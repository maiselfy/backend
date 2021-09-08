import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    } catch (error) {
      if (error) return error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
