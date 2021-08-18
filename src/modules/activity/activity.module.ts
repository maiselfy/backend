import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Habit from '../habit/infra/typeorm/entities/Habit';
import User from '../user/infra/typeorm/entities/User';
import NoteController from './infra/htttp/note.controller';
import Note from './infra/typeorm/entities/Note';
import CreateNoteForHabitService from './services/createNoteForHabit.service';
import DeleteNoteForHabitService from './services/deleteNoteForHabit.service';
import GetNoteForHabitService from './services/getNoteForHabit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, Note, User])],
  controllers: [NoteController],
  providers: [
    CreateNoteForHabitService,
    DeleteNoteForHabitService,
    GetNoteForHabitService,
  ],
})
export class ActivityModule {}
