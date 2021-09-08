import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';

@Injectable()
export default class ViewHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(id: string, user_id: string): Promise<Habit> {
    try {
      const habit = await this.habitsRepository.findOne({
        where: { id: id },
      });

      if (!habit) {
        throw new HttpException(
          'This habit does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const isTheUserHabit = await this.habitsRepository.findOne({
        where: { user_id },
      });

      if (!isTheUserHabit) {
        throw new HttpException(
          'There is no corresponding habit for this user',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return habit;
    } catch (error) {
      if (error) return error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
