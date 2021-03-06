import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import { Repository } from 'typeorm';
import User from '../../user/infra/typeorm/entities/User';
import Note from '../infra/typeorm/entities/Note';

@Injectable()
export default class GetNoteForHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async execute(user_id: string, habit_id: string): Promise<Note[]> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: user_id },
      });

      if (!findUser) throw new NotFoundException('No user was found');

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

      const isTheNoteForHabit = await this.notesRepository.find({
        where: { habit_id: habit_id, user_id: user_id },
      });

      if (!isTheNoteForHabit) {
        throw new HttpException(
          'This note does not exist in the our database.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return isTheNoteForHabit;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
