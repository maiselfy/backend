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
import GetHabitDayCheckOfSevenDaysService from '../../services/getHabitDayCheckOfSevenDays.service';

@Controller('habitCheck')
export default class HabitDayCheckController {
  constructor(
    private registerCheckInHabitService: RegisterCheckInHabitService,
    private getHabitDayCheckOfSevenDaysService: GetHabitDayCheckOfSevenDaysService,
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

  @Get('listChecks/:user_id')
  listChecks(@Param('user_id') user_id: string): Promise<Habit> {
    return this.getHabitDayCheckOfSevenDaysService.execute(user_id);
  }
}
