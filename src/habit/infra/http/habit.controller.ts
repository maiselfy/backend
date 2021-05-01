import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import Habit from '../typeorm/entities/Habit';

import CreateHabitService from '../../services/createHabit.service';
import DeleteHabitService from '../../services/deleteHabit.service';
import ICreateHabitDTO from '../../dtos/ICreateHabitDTO';

@Controller('habit')
export class HabitController {
  constructor(
    private createHabitService: CreateHabitService,
    private deleteHabitService: DeleteHabitService,
  ) {}

  @Post()
  createHabit(
    @Body()
    {
      name,
      description,
      reminderQuestion,
      color,
      frequency,
      reminder,
      pontuation,
    }: ICreateHabitDTO,
  ): Promise<Habit> {
    const habit = this.createHabitService.execute({
      name,
      description,
      reminderQuestion,
      color,
      frequency,
      reminder,
      pontuation,
    });
    return habit;
  }

  @Delete('/:id')
  async deleteHabit(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.deleteHabitService.execute(id);
    return res.status(204).send();
  }
}
