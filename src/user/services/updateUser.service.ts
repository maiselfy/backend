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
    { name, lastname, email, password, birthdate }: IUpdateUserDTO,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        'This user does not exist in the our database.',
        HttpStatus.NOT_FOUND,
      );
    }

    const emailExists = await this.usersRepository.findOne({
      where: { email },
    });
    if (emailExists) {
      throw new HttpException(
        'The email already is used by another user.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordHash = await this.HashProvider.generateHash(password);

    const updatedUser = this.usersRepository.merge(user, {
      name,
      lastname,
      email,
      password: passwordHash,
      birthdate,
    });

    await this.usersRepository.save(updatedUser);

    return updatedUser;
  }
}
