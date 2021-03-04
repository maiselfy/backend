import {
  Body,
  Controller,
  Delete,
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
import User from '../typeorm/entities/User';
import UploadConfig from '../../../config/upload.config';
import ICreateUserDTO from 'src/user/dtos/ICreateUserDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import CreateUserService from '../../services/createUser.service';
import IUpdateUserDTO from 'src/user/dtos/IUpdateUserDTO.interface';
import UpdateUserService from 'src/user/services/updateUser.service';
import UpdateUserAvatarService from '../../services/updateUserAvatar.service';
import DeleteUserService from 'src/user/services/deleteUser.service';
import { DeleteResult } from 'typeorm';
@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserAvatarService: UpdateUserAvatarService,
    private updateUserService: UpdateUserService,
    private deleteUserService: DeleteUserService,
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
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() { name, lastname, email, password, birthdate }: IUpdateUserDTO,
  ): Promise<User> {
    const updatedUser = this.updateUserService.execute(id, {
      name,
      lastname,
      email,
      password,
      birthdate,
    });
    return updatedUser;
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
