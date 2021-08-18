import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';

@Injectable()
export default class GetChecksOnIntervalService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({ userId, habitId, date }): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );
      }

      const habit = await this.habitsRepository.findOne({
        where: { id: habitId },
      });

      if (!habit) {
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered habit',
          HttpStatus.NOT_FOUND,
        );
      }

      const today = new Date();

      const registerChecksForInterval = await this.daysCheckRepository.findAndCount(
        {
          where: {
            user_id: userId,
            habit_id: habitId,
            date: Between(date, today),
          },
        },
      );

      const response = {
        checks: registerChecksForInterval[0],
        numberOfChecks: registerChecksForInterval[1],
      };

      return response;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
