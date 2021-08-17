import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import IRegisterCheckInHabitDTO from '../dtos/IRegisterCheckInHabitDTO';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';

@Injectable()
export default class RegisterCheckInHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(User)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({
    user_id,
    habit_id,
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

      const checkInHabit = this.daysCheckRepository.create({
        user_id,
        habit_id,
        date: new Date().getDate(),
      });

      await this.daysCheckRepository.save(checkInHabit);

      return checkInHabit;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
