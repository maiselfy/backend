import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';

import Habit from '../typeorm/entities/Habit';
import { Habit as HabitDecorator } from '../decorators/habit.decorator';
import ICreateHabitDTO from '../../dtos/ICreateHabitDTO';
import CreateHabitService from '../../services/createHabit.service';
import UpdateHabitService from '../../services/updateHabit.service';
import IUpdateHabitDTO from '../../dtos/IUpdateHabitDTO';

@Controller('habit')
export default class HabitController {
  constructor(
    private createHabitService: CreateHabitService,
    private updateHabitService: UpdateHabitService,
  ) {}

  @Get('/habit')
  getHabit(@HabitDecorator() habit) {
    return habit;
  }

  @Post()
  createHabit(
    @Body()
    { user_id, name, description, objective, color, buddy_id }: ICreateHabitDTO,
  ): Promise<Habit> {
    return this.createHabitService.execute({
      user_id,
      name,
      description,
      objective,
      color,
      buddy_id,
    });
  }

  @Put(':id')
  updateHabit(
    @Param('id') id: string,
    @Body() { name, description, objective, color }: IUpdateHabitDTO,
  ): Promise<Habit> {
    return this.updateHabitService.execute(id, {
      name,
      description,
      objective,
      color,
    });
  }
}
