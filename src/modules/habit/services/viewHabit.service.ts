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
    const habit = await this.habitsRepository.findOne({
      where: { id: id, user_id: user_id },
    });

    if (!habit) {
      throw new HttpException(
        'There is no habit for this user registered in our database',
        HttpStatus.NOT_FOUND,
      );
    }

    return habit;
  }
}
