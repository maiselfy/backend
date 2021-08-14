import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import RegisterCheckInHabitService from '../../services/registerCheckInHabit.service';
import IRegisterCheckInHabitDTO from '../../dtos/IRegisterCheckInHabitDTO';
import HabitDayCheck from '../typeorm/entities/HabitDayCheck';
import GetCurrentWeekFrequency from '../../services/getCurrentWeekFrequency.service';
import RemoveCheckInHabitService from '../../services/removeCheckInHabit.service';

@Controller('habitCheck')
export default class HabitDayCheckController {
  constructor(
    private registerCheckInHabitService: RegisterCheckInHabitService,
    private getCurrentWeekFrequency: GetCurrentWeekFrequency,
    private removeCheckInHabitService: RemoveCheckInHabitService,
  ) {}

  @Post()
  registerHabitDayCheck(
    @Body()
    { user_id, habit_id, date }: IRegisterCheckInHabitDTO,
  ): Promise<HabitDayCheck> {
    return this.registerCheckInHabitService.execute({
      user_id,
      habit_id,
      date,
    });
  }

  @Get('listChecks/:userId/:habitId')
  getHabitDayCheckOfSevenDays(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<HabitDayCheck> {
    return this.getCurrentWeekFrequency.execute({ habitId, userId });
  }

  @Delete('delete/:habit_id/:user_id/:date')
  removerHabitDayCheck(
    @Param('habit_id') habit_id: string,
    @Param('user_id') user_id: string,
    @Param('date') date: string,
  ) {
    this.removeCheckInHabitService
      .execute(habit_id, user_id, date)
      .then(res => {
        console.log(res);
      });
  }
}
