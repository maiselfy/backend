import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from '../../../modules/user/infra/typeorm/entities/User';
import IRegisterCheckInHabitDTO from '../dtos/IRegisterCheckInHabitDTO';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';
import { format } from 'date-fns';
import { parse } from 'date-fns';

@Injectable()
export default class RegisterCheckInHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({
    user_id,
    habit_id,
    date,
  }: IRegisterCheckInHabitDTO): Promise<HabitDayCheck> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user) {
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );
      }

      const habit = await this.habitsRepository.findOne({
        where: { id: habit_id },
      });

      if (!habit) {
        throw new HttpException(
          'This habit does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (habit.user_id != user_id) {
        throw new HttpException(
          'There is no corresponding habit for this user',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const dateFormatted = new Date(date);
      dateFormatted.setHours(0, 0, 0, 0);

      const checkAlreadyExists = await this.daysCheckRepository.find({
        where: {
          user_id,
          habit_id,
          date: dateFormatted,
        },
      });

      if (checkAlreadyExists === [])
        throw new UnauthorizedException('This date is already marked');

      const checkInHabit = this.daysCheckRepository.create({
        user_id,
        habit_id,
        date: dateFormatted,
      });

      await this.daysCheckRepository.save(checkInHabit);

      return checkInHabit;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
