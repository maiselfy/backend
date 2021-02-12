import { Inject, Injectable } from '@nestjs/common';
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
    const userExists = await this.usersRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new Error('This email does not exist in the our database.');
    }

    const verifyUserPassword = await this.HashProvider.compareHash(
      password,
      userExists.password,
    );

    if (!verifyUserPassword) {
      throw new Error('Password does not match');
    }
    const token = this.jwtService.sign({
      name: userExists.name,
      lastname: userExists.lastname,
      birthdate: userExists.birthdate,
    });
    return token;
  }
}
