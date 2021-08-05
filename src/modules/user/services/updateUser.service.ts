import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO.interface';
import User from '../infra/typeorm/entities/User';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@Injectable()
export default class UpdateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
  ) {}

  async execute(
    id: string,
    { name, lastname, username, email, password, birthdate }: IUpdateUserDTO,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(
          'This user does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.email != email) {
        const emailExists = await this.usersRepository.findOne({
          where: { email },
        });
        
      if (emailExists) {
        throw new HttpException(
          'The email already is used by another user.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (user.username != username) {
        const usernameExists = await this.usersRepository.findOne({
          where: { username },
        });

        if (usernameExists) {
          throw new HttpException(
            'The username already is used by another user, please choose a different.',
            HttpStatus.CONFLICT,
          );
        }
      }

      const passwordHash = await this.HashProvider.generateHash(password);

      const updatedUser = this.usersRepository.merge(user, {
        name,
        lastname,
        username,
        email,
        password: passwordHash,
        birthdate,
      });

      await this.usersRepository.save(updatedUser);

      return updatedUser;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
