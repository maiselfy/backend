import { Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from '../../user/infra/typeorm/entities/User';

@Injectable()
export default class ListHabitsService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(id: string): Promise<Habit[]> {
    const allHabits = await this.habitsRepository.find({
      where: { user_id: id },
    });

    const haveHabits = allHabits.length;

    if (haveHabits === 0 || null) {
      throw new HttpException(
        'Sorry, this user has no registered habits',
        HttpStatus.NOT_FOUND,
      );
    }

    return allHabits;
  }
}
