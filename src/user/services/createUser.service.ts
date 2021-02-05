import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';
import Body from '../infra/typeorm/entities/Body';

@Injectable()
export default class Service {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async execute({
    name,
    lastname,
    email,
    password,
    birthdate,
    body,
  }: ICreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new Error('This email already in use.');
    }
    const user = this.usersRepository.create({
      name,
      lastname,
      email,
      password,
      birthdate,
      bodies: [body],
    });
    await this.usersRepository.save(user);
    return user;
  }
}
