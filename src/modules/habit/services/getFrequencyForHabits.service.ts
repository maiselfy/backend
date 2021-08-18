import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';
import * as datefns from 'date-fns';

interface GetCurrentWeekFrequencyProps {
  userId: string;
  habitId: string;
}
@Injectable()
export default class GetFrequencyForHabitsService {
  public dayOfWeekChecks: any[];

  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({ userId, habitId }): Promise<any> {
    this.dayOfWeekChecks = [];
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

      const allRegisterChecks = await this.daysCheckRepository.findAndCount({
        where: {
          user_id: userId,
          habit_id: habitId,
          date: Between(habit.created_at, today),
        },
      });

      const diff =
        Between(habit.created_at.getUTCDate(), today.getUTCDate()).value[1] -
        Between(habit.created_at.getUTCDate(), today.getUTCDate()).value[0];

      allRegisterChecks[0].forEach(check => {
        if (check.date.getDay() === 0) {
          this.dayOfWeekChecks.push('Sunday');
        } else if (check.date.getDay() === 1) {
          this.dayOfWeekChecks.push('Monday');
        } else if (check.date.getDay() === 2) {
          this.dayOfWeekChecks.push('Tuesday');
        } else if (check.date.getDay() === 3) {
          this.dayOfWeekChecks.push('Wednesday');
        } else if (check.date.getDay() === 4) {
          this.dayOfWeekChecks.push('Thursday');
        } else if (check.date.getDay() === 5) {
          this.dayOfWeekChecks.push('Friday');
        } else if (check.date.getDay() === 6) {
          this.dayOfWeekChecks.push('Saturday');
        }
      });

      const countMap = Object.create(null);

      for (const element of this.dayOfWeekChecks) {
        countMap[element] = (countMap[element] || 0) + 1;
      }

      const result = Object.entries(countMap).map(([value, count]) => ({
        day: value,
        quantity: count,
      }));

      const checksPerDayOfWeek = result.reduce(
        (acc, element) => {
          if (element.quantity > acc.quantity) {
            acc = {
              day: element.day,
              quantity: element.quantity,
            };
          }
          return acc;
        },
        {
          day: '',
          quantity: 0,
        },
      );

      const response = {
        checks: allRegisterChecks[0],
        numberOfChecks: allRegisterChecks[1],
        numberOfDays: diff,
        bestDay: checksPerDayOfWeek.day,
        countOfBestDay: checksPerDayOfWeek.quantity,
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
