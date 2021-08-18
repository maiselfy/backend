import { Repository } from 'typeorm';
import Habit from '../../habit/infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Note from '../infra/typeorm/entities/Note';
import ICreateNoteDTO from '../dtos/ICreateNoteDTO';

@Injectable()
export default class CreateNoteForHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute({ user_id, habit_id, note }: ICreateNoteDTO): Promise<Note> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );

      const noteForHabit = this.notesRepository.create({
        user_id,
        habit_id,
        note,
      });

      await this.notesRepository.save(noteForHabit);

      return noteForHabit;
    } catch (error) {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
