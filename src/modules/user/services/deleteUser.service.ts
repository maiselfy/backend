import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';

@Injectable()
export default class DeleteUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      const userExists = await this.usersRepository.findOne({
        where: { id: id },
      });

      if (!userExists) {
        throw new HttpException(
          'This user does not exist in our database.',
          HttpStatus.NOT_FOUND,
        );
      }
      const successfulDelete = await this.usersRepository.delete(id);

      if (
        (successfulDelete.raw == 0 || successfulDelete.raw == null) &&
        successfulDelete.affected == 1
      ) {
        return true;
      }
      return false;
    } catch {
      throw new HttpException(
        'Sorry, we were unable to remove the user.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
