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
import GetHabitDayCheckOfSevenDaysService from '../../services/getHabitDayCheckOfSevenDays.service';
import RemoveCheckInHabitService from '../../services/removeCheckInHabit.service';

@Controller('habitCheck')
export default class HabitDayCheckController {
  constructor(
    private registerCheckInHabitService: RegisterCheckInHabitService,
    private getHabitDayCheckOfSevenDaysService: GetHabitDayCheckOfSevenDaysService,
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

  @Get('listChecks/:user_id')
  getHabitDayCheckOfSevenDays(
    @Param('user_id') user_id: string,
  ): Promise<HabitDayCheck> {
    return this.getHabitDayCheckOfSevenDaysService.execute(user_id);
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
