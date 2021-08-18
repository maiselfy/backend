import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import ICreateNoteDTO from '../../dtos/ICreateNoteDTO';
import CreateNoteForHabitService from '../../services/createNoteForHabit.service';
import DeleteNoteForHabitService from '../../services/deleteNoteForHabit.service';
import GetNoteForHabitService from '../../services/getNoteForHabit.service';
import Note from '../typeorm/entities/Note';

@Controller('note')
export default class NoteController {
  constructor(
    private createNoteForHabitService: CreateNoteForHabitService,
    private deleteNoteForHabitService: DeleteNoteForHabitService,
    private getNoteForHabitService: GetNoteForHabitService,
  ) {}

  @Post()
  createNoteForHabit(
    @Body()
    { user_id, habit_id, note }: ICreateNoteDTO,
  ): Promise<Note> {
    return this.createNoteForHabitService.execute({
      user_id,
      habit_id,
      note,
    });
  }

  @Delete('delete/:id/:user_id/:habit_id')
  async deleteHabit(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Param('habit_id') habit_id: string,

    @Res() res: Response,
  ): Promise<Response> {
    const successfulDelete = await this.deleteNoteForHabitService.execute(
      id,
      user_id,
      habit_id,
    );
    if (successfulDelete.valueOf()) {
      return res.status(204).send({ message: 'Note has been deleted.' });
    }
  }

  @Get('getNote/:id/:userId/:habitId')
  getNoteForHabit(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<Note> {
    return this.getNoteForHabitService.execute(id, userId, habitId);
  }
}
