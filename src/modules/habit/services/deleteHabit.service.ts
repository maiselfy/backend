import { DeleteResult, Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export default class DeleteHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(id: string, user_id: string): Promise<DeleteResult> {
    try {
      const habit = await this.habitsRepository.findOne({
        where: { id: id, user_id: user_id },
      });

      if (!habit) {
        throw new HttpException(
          'There is no habit for this user registered in our database',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.habitsRepository.delete(id);
    } catch {
      throw new HttpException(
        'Sorry, we were unable to remove the habit.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
