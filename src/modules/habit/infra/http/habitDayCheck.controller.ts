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

import Habit from '../typeorm/entities/Habit';
import RegisterCheckInHabitService from '../../services/registerCheckInHabit.service';
import IRegisterCheckInHabitDTO from '../../dtos/IRegisterCheckInHabitDTO';
import HabitDayCheck from '../typeorm/entities/HabitDayCheck';

@Controller('habitCheck')
export default class HabitDayCheckController {
  constructor(
    private registerCheckInHabitService: RegisterCheckInHabitService,
  ) {}

  @Post()
  registerHabitDayCheck(
    @Body()
    { user_id, habit_id }: IRegisterCheckInHabitDTO,
  ): Promise<HabitDayCheck> {
    return this.registerCheckInHabitService.execute({
      user_id,
      habit_id,
      date: new Date().getDate(),
    });
  }
}
