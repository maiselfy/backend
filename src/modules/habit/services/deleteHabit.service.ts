import { DeleteResult, Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export default class DeleteHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(id: string, user_id: string): Promise<boolean> {
    try {
      const habit = await this.habitsRepository.findOne({
        where: { id: id, user_id: user_id },
      });

      if (!habit) {
        throw new HttpException(
          'There is no habit for this user registered in our database',
          HttpStatus.NOT_FOUND,
        );
      }
      const successfulDelete = await this.habitsRepository.delete(id);

      if (
        (successfulDelete.raw == 0 || successfulDelete.raw == null) &&
        successfulDelete.affected == 1
      ) {
        return true;
      }
      return false;
    } catch {
      throw new HttpException(
        'Sorry, we were unable to remove the habit.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
