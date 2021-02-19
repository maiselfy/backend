import { Body, Controller, Post, Put, Param } from '@nestjs/common';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import User from '../typeorm/entities/User';
import CreateUserService from '../../services/createUser.service';
import UpdateUserService from '../../services/updateUser.service';
import IUpdateUserDTO from 'src/user/dtos/IUpdateUserDTO.interface';

@Controller('user')
export class HttpController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserService: UpdateUserService,
  ) {}
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

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() { name, lastname, email }: IUpdateUserDTO,
  ): Promise<User> {
    const updatedUser = this.updateUserService.execute(id, {
      name,
      lastname,
      email,
    });
    return updatedUser;
  }
}
