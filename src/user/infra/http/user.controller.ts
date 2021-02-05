import { Body, Controller, Post } from '@nestjs/common';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import { getRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import CreateUserService from '../../services/createUser.service';
@Controller('user')
export class HttpController {
  @Post()
  createUser(
    @Body()
    { name, lastname, email, password, birthdate, body }: ICreateUserDTO,
  ): Promise<User> {
    const createUserService = new CreateUserService(getRepository(User));
    const user = createUserService.execute({
      name,
      lastname,
      email,
      password,
      birthdate,
      body,
    });
    return user;
  }
}
