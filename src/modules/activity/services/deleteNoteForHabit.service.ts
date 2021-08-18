import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Habit from 'src/modules/habit/infra/typeorm/entities/Habit';
import Note from '../infra/typeorm/entities/Note';

@Injectable()
export default class DeleteNoteForHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async execute(
    id: string,
    user_id: string,
    habit_id: string,
  ): Promise<boolean> {
    try {
      const habit = await this.habitsRepository.findOne({
        where: { id: habit_id },
      });

      if (!habit) {
        throw new HttpException(
          'This habit does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const isTheUserHabit = await this.habitsRepository.findOne({
        where: { user_id },
      });

      if (!isTheUserHabit) {
        throw new HttpException(
          'There is no corresponding habit for this user',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isTheNoteForHabit = await this.notesRepository.findOne({
        where: { id },
      });

      if (!isTheNoteForHabit) {
        throw new HttpException(
          'This note does not exist in the our database.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const successfulDelete = await this.notesRepository.delete(
        isTheNoteForHabit.id,
      );

      if (
        (successfulDelete.raw == 0 || successfulDelete.raw == null) &&
        successfulDelete.affected == 1
      ) {
        return true;
      }
      return false;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
