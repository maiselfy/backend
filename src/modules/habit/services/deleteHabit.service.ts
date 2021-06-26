import { DeleteResult, Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export default class UpdateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(id: string): Promise<DeleteResult> {
    try {
      const habit = await this.habitsRepository.findOne({
        where: { id: id },
      });

      if (!habit) {
        throw new HttpException(
          'This habit does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const successfulDelete = await this.habitsRepository.delete(id);
      return successfulDelete;
    } catch {
      throw new HttpException(
        'Sorry, we were unable to remove the habit.',
        HttpStatus.CONFLICT,
      );
    }
  }
}
