import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import RegisterCheckInHabitService from '../../services/registerCheckInHabit.service';
import IRegisterCheckInHabitDTO from '../../dtos/IRegisterCheckInHabitDTO';
import HabitDayCheck from '../typeorm/entities/HabitDayCheck';
import GetCurrentWeekFrequency from '../../services/getCurrentWeekFrequency.service';
import RemoveCheckInHabitService from '../../services/removeCheckInHabit.service';
import { User as UserDecorator } from 'src/modules/user/infra/http/decorators/user.decorator';
import User from 'src/modules/user/infra/typeorm/entities/User';
import GetFrequencyForHabitsService from '../../services/getFrequencyForHabits.service';
import GetDataForHeatmapService from '../../services/getDataForHeatmap.service';
import GetChecksOnIntervalService from '../../services/getChecksOnInterval.service';
import CalculateEstabilityRateService from '../../services/calculateEstabilityRate.service';
import CalculateEstabilityRateGenerallyService from '../../services/calculateEstabilityRateGenerally.service';

@Controller('habitCheck')
export default class HabitDayCheckController {
  constructor(
    private registerCheckInHabitService: RegisterCheckInHabitService,
    private getCurrentWeekFrequency: GetCurrentWeekFrequency,
    private removeCheckInHabitService: RemoveCheckInHabitService,
    private getFrequencyForHabitsService: GetFrequencyForHabitsService,
    private getDataForHeatmapService: GetDataForHeatmapService,
    private getChecksOnIntervalService: GetChecksOnIntervalService,
    private calculateEstabilityRateService: CalculateEstabilityRateService,
    private calculateEstabilityRateGenerallyService: CalculateEstabilityRateGenerallyService,
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

  @Delete('delete/:habit_id/:date')
  removerHabitDayCheck(
    @Param('habit_id') habit_id: string,
    @Param('date') date: string,
    @UserDecorator() user: User,
  ) {
    this.removeCheckInHabitService.execute(
      habit_id,
      user.id,
      new Date(date).toUTCString(),
    );
  }

  @Get('listAllChecks/:userId/:habitId')
  getAllChecks(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<HabitDayCheck> {
    return this.getFrequencyForHabitsService.execute({
      habitId,
      userId,
    });
  }

  @Get('listChecksOnInterval/:userId/:habitId/:date')
  getChecksOnInterval(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
    @Param('date') date: string,
  ): Promise<HabitDayCheck> {
    return this.getChecksOnIntervalService.execute({
      habitId,
      userId,
      date,
    });
  }

  @Get('dataForHeatmap/:userId/:habitId')
  getDataForHeatmap(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<HabitDayCheck> {
    return this.getDataForHeatmapService.execute({
      habitId,
      userId,
    });
  }

  @Get('dataForHeatmapOfYear/:userId/:habitId')
  getDataForHeatmapOfYear(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<HabitDayCheck> {
    return this.getDataForHeatmapService.execute({
      habitId,
      userId,
    });
  }

  @Get('estabilityRate/:userId/:habitId')
  calculateEstabilityRate(
    @Param('userId') userId: string,
    @Param('habitId') habitId: string,
  ): Promise<any> {
    return this.calculateEstabilityRateService.execute({
      habitId,
      userId,
    });
  }

  @Get('estabilityRateGenerally/:userId/')
  calculateEstabilityRateGenerally(
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.calculateEstabilityRateGenerallyService.execute({
      userId,
    });
  }
}
