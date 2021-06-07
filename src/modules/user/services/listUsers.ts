import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import User from '../infra/typeorm/entities/User';
import uploadConfig from 'src/config/upload.config';
import { promises } from 'fs';

@Injectable()
export default class ListUsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
}
