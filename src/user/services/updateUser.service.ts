import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO.interface';
import User from '../infra/typeorm/entities/User';

@Injectable()
export default class UpdateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(
    id: string,
    { name, lastname, email }: IUpdateUserDTO,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const updatedUser = await this.usersRepository.merge(user, {
      name,
      lastname,
      email,
    });
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }
}
