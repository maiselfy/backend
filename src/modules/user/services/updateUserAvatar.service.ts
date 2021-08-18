import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import User from '../infra/typeorm/entities/User';
import uploadConfig from '../../../config/upload.config';
import { promises } from 'fs';

interface Request {
  userId: string;
  avatarFilename: string;
}

@Injectable()
export default class UpdateUserAvatarService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async execute({ userId, avatarFilename }: Request): Promise<User> {
    try {
      const user = await this.usersRepository.findOne(userId);
      if (!user) {
        throw new HttpException(
          'Only authenticated users can chage avatar',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (user.avatar) {
        const userAvatarFilePath = join(uploadConfig.directory, user.avatar);
        const userAvatarFileExists = await promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
          await promises.unlink(userAvatarFilePath);
        }
      }

      user.avatar = avatarFilename;
      await this.usersRepository.save(user);
      return user;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
