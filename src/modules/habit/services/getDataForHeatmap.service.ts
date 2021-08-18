import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';
import { format, getDay, getMonth } from 'date-fns';

interface InterfaceN {
  [key: string]: {
    id: string;
    user_id: string;
    habit_id: string;
    date: Date;
  }[];
}

@Injectable()
export default class GetDataForHeatmapService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({ userId, habitId }): Promise<any> {
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

      const initOfYear = new Date();
      initOfYear.setMonth(0);
      initOfYear.setDate(1);
      initOfYear.setHours(0, 0, 0, 0);

      const today = new Date();

      const allRegisterChecks = await this.daysCheckRepository.find({
        where: {
          user_id: userId,
          habit_id: habitId,
          date: Between(initOfYear, today),
        },
      });

      const response = allRegisterChecks.reduce((acc: InterfaceN, object) => {
        const key = format(new Date().setMonth(getMonth(object.date)), 'MMMM');
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(object);
        return acc as InterfaceN;
      }, {});

      const days = [0, 1, 2, 3, 4, 5, 6];
      const result = Object.entries(response).map(month => {
        const values = [];
        days.forEach(day => {
          const occorrences = month[1].reduce((acc, data) => {
            if (getDay(data.date) === day) return acc + 1;
            return acc;
          }, 0);
          values.push(occorrences);
        });
        return { [month[0]]: values };
      });

      return result;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
