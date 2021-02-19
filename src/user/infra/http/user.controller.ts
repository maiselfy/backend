import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import User from '../typeorm/entities/User';
import CreateUserService from '../../services/createUser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import UploadConfig from '../../../config/upload.config';
@Controller('user')
export class UserController {
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

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file', UploadConfig))
  updateAvatar(@UploadedFile() file): any {
    return { file };
  }
}
