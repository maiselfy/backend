import { Inject, Injectable } from '@nestjs/common';
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
      throw new Error('This user does not exist in the our database.');
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
