import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';

@Injectable()
export default class CreateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
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
      throw new HttpException(
        'This email already in use.',
        HttpStatus.CONFLICT,
      );
    }
    const passwordHash = await this.HashProvider.generateHash(password);
    const user = this.usersRepository.create({
      name,
      lastname,
      email,
      password: passwordHash,
      birthdate,
      bodies: [body],
    });
    await this.usersRepository.save(user);
    return user;
  }
}
