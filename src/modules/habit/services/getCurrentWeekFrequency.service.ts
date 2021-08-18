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
export default class GetCurrentWeekFrequency {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({
    userId,
    habitId,
  }: GetCurrentWeekFrequencyProps): Promise<any> {
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
      const initOfWeek = datefns.startOfWeek(today);
      const endOfWeek = datefns.endOfWeek(today);

      const registerChecks = await this.daysCheckRepository.find({
        where: {
          user_id: userId,
          habit_id: habitId,
          date: Between(initOfWeek, endOfWeek),
        },
      });

      const dates = this.getDates(initOfWeek, endOfWeek);

      return dates.map(dateItem => {
        const findCheck = registerChecks.find(check =>
          datefns.isEqual(check.date, dateItem),
        );
        if (findCheck) {
          return {
            date: dateItem,
            checked: true,
          };
        }
        return {
          date: dateItem,
          checked: false,
        };
      });
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private getDates(startDate, endDate) {
    const dates = [];
    let currentDate = startDate;
    const addDays = function(days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }
}
