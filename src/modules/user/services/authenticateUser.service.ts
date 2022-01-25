import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import { ICreateSessionDTO } from '../dtos/ICreateSessionDTO';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthenticateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: ICreateSessionDTO) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        throw new HttpException(
          'This email does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const verifyUserPassword = await this.HashProvider.compareHash(
        password,
        user.password,
      );

      if (!verifyUserPassword) {
        throw new HttpException(
          'Password does not match',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.jwtService.sign({
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      });
    } catch (error) {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
