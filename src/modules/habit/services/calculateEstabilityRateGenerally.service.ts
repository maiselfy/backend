import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Habit from '../infra/typeorm/entities/Habit';
import User from 'src/modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';

@Injectable()
export default class CalculateEstabilityRateGenerallyService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(HabitDayCheck)
    private daysCheckRepository: Repository<HabitDayCheck>,
  ) {}

  async execute({ userId }): Promise<any> {
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

      const today = new Date();

      const initOfYear = new Date();
      initOfYear.setMonth(0);
      initOfYear.setDate(1);
      initOfYear.setHours(0, 0, 0, 0);

      const finishOfYear = new Date();
      finishOfYear.setMonth(11);
      finishOfYear.setDate(31);
      finishOfYear.setHours(23, 59, 59, 59);

      const checks = await this.daysCheckRepository.findAndCount({
        where: {
          user_id: userId,
          date: Between(initOfYear, finishOfYear),
        },
      });

      const estabilityRate = (checks[1] / 365).toFixed(2);
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
