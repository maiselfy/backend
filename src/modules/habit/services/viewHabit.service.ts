import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';

@Injectable()
export default class ViewHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(user_id: string, id: string): Promise<Habit> {
    const habitsOfUser = await this.habitsRepository.find({
      where: { user_id: user_id },
    });

    if (habitsOfUser.length === 0 || null) {
      throw new HttpException(
        'Sorry, this user has no registered habits.',
        HttpStatus.NOT_FOUND,
      );
    }

    const habit = await this.habitsRepository.findOne({ where: { id: id } });

    if (!habit) {
      throw new HttpException(
        'This habit does not exist in the our database.',
        HttpStatus.NOT_FOUND,
      );
    }

    return habit;
  }
}
