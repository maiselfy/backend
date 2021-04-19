import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';

@Injectable()
export default class DeleteHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(id: string): Promise<DeleteResult> {
    try {
      const habitExists = await this.habitsRepository.findOne(id);
      if (!habitExists)
        throw new HttpException(
          'There is no corresponding habit registered for this user.',
          HttpStatus.CONFLICT,
        );
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
