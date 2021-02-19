import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import User from '../typeorm/entities/User';
import CreateUserService from '../../services/createUser.service';
import UpdateUserAvatarService from '../../services/updateUserAvatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import UploadConfig from '../../../config/upload.config';
import { Request, Response } from 'express';
@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserAvatarService: UpdateUserAvatarService,
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

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file', UploadConfig))
  async updateAvatar(
    @UploadedFile() file,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.updateUserAvatarService.execute({
        userId: req.user.id,
        avatarFilename: file.filename,
      });
      return res.json(updatedUser);
    } catch (error) {
      return res
        .status(400)
        .json(error)
        .send();
    }
  }
}
