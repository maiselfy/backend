import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';
import { addDays } from 'date-fns';
import { intervalToDuration } from 'date-fns';

@Injectable()
export default class CalculateEstabilityRateService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  datesChek: any[];
  dates: any[];
  intervals: any[];
  async execute({ userId, habitId }): Promise<any> {
    this.datesChek = [];
    this.dates = [];
    this.intervals = [];
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

      const firstRecord = await this.daysCheckRepository.findOne({
        where: { habit_id: habit.id },
      });

      const today = new Date();

      const differenceBetweenDays =
        Between(firstRecord.date.getUTCDate(), today.getUTCDate()).value[1] -
        Between(firstRecord.date.getUTCDate(), today.getUTCDate()).value[0];

      const checksForHabit = await this.daysCheckRepository.findAndCount({
        where: {
          user_id: userId,
          habit_id: habitId,
          date: Between(firstRecord.date, today),
        },
      });

      checksForHabit[0].forEach(check => {
        this.datesChek.push(check.date);
      });

      let date = new Date(firstRecord.date);

      for (let i = 0; i <= differenceBetweenDays; i++) {
        this.dates.push(date);
        date = addDays(date, 1);
      }

      let interval;
      for (let i = 0; i < this.datesChek.length; i++) {
        if (i == this.datesChek.length - 1) {
          interval = intervalToDuration({
            start: this.datesChek[i],
            end: today,
          });
        } else {
          interval = intervalToDuration({
            start: this.datesChek[i],
            end: this.datesChek[i + 1],
          });
        }
        this.intervals.push(interval);
      }

      const fm = Number(checksForHabit[1] / differenceBetweenDays);
      const rf = Number(4 / differenceBetweenDays);

      const estabilityRate = (fm / rf).toFixed(2);
      return estabilityRate;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
