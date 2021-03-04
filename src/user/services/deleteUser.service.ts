import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';

@Injectable()
export default class DeleteUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(id: string): Promise<DeleteResult> {
    try {
      const userExists = await this.usersRepository.findOne(id);
      if (!userExists) {
        throw new HttpException(
          'This user does not exist in our database.',
          HttpStatus.CONFLICT,
        );
      }
      const successfulDelete = await this.usersRepository.delete(id);
      return successfulDelete;
    } catch {
      throw new HttpException(
        'Sorry, we were unable to remove the user.',
        HttpStatus.CONFLICT,
      );
    }
  }
}
