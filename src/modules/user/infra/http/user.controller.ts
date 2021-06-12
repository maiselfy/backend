import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import User from '../typeorm/entities/User';
import { User as UserDecorator } from '../http/decorators/user.decorator';
import UploadConfig from '../../../../config/upload.config';
import ICreateUserDTO from 'src/modules/user/dtos/ICreateUserDTO';
import CreateUserService from '../../services/createUser.service';
import IUpdateUserDTO from 'src/modules/user/dtos/IUpdateUserDTO.interface';
import UpdateUserService from 'src/modules/user/services/updateUser.service';
import UpdateUserAvatarService from '../../services/updateUserAvatar.service';
import DeleteUserService from 'src/modules/user/services/deleteUser.service';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserAvatarService: UpdateUserAvatarService,
    private updateUserService: UpdateUserService,
    private deleteUserService: DeleteUserService,
  ) {}

  @Get('/me')
  getMe(@UserDecorator() user) {
    return user;
  }

  @Post()
  createUser(
    @Body()
    { name, lastname, email, password, birthdate, body }: ICreateUserDTO,
  ): Promise<User> {
    return this.createUserService.execute({
      name,
      lastname,
      email,
      password,
      birthdate,
      body,
    });
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
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() { name, lastname, email, password, birthdate }: IUpdateUserDTO,
  ): Promise<User> {
    return this.updateUserService.execute(id, {
      name,
      lastname,
      email,
      password,
      birthdate,
    });
  }

  @Delete('delete/:id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.deleteUserService.execute(id);
    return res.status(204).send();
  }
}
