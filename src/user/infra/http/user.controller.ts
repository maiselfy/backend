import { Body, Controller, Patch, Post } from '@nestjs/common';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import User from '../typeorm/entities/User';
import CreateUserService from '../../services/createUser.service';
@Controller('user')
export class HttpController {
  constructor(private createUserService: CreateUserService) {}
  @Post()
  createUser(
    @Body()
    { name, lastname, email, password, birthdate, body }: ICreateUserDTO,
  ): Promise<User> {
    const user = this.createUserService.execute({
      name,
      lastname,
      email,
      password,
      birthdate,
      body,
    });
    return user;
  }

  @Patch()
  updateAvatar(): Promise<User> {}
}
