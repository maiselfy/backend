import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export default class CreateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectSendGrid() private readonly sendgrid: SendGridService,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
  ) {}
  async execute({
    name,
    lastname,
    email,
    password,
    birthdate,
    username,
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
      username,
    });
    await this.usersRepository.save(user);
    // await this.sendgrid
    //   .send({
    //     to: email,
    //     from: 'no-reply@maiself.com.br',
    //     subject: 'Welcome to Maiself',
    //     templateId: 'd-edce0598398f458692d26ae47ae5dbda',
    //     dynamicTemplateData: {
    //       first_name: name,
    //     },
    //   })
    //   .catch(error => {
    //     console.error(error.response.body);
    //   });
    return user;
  }
}
