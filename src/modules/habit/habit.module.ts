import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import HabitController from './infra/http/habit.controller';
import Habit from './infra/typeorm/entities/Habit';
import HabitDayCheck from './infra/typeorm/entities/HabitDayCheck';
import CreateHabitService from './services/createHabit.service';
import ListHabitsService from './services/listHabits.service';
import ViewHabitService from './services/viewHabit.service';
import DeleteHabitService from './services/deleteHabit.service';
import UpdateHabitService from './services/updateHabit.service';
import User from '../user/infra/typeorm/entities/User';
import RegisterCheckInHabitService from './services/registerCheckInHabit.service';
import GetCurrentWeekFrequency from './services/getCurrentWeekFrequency.service';
import HabitDayCheckController from './infra/http/habitDayCheck.controller';
import RemoveCheckInHabitService from './services/removeCheckInHabit.service';
import GetFrequencyForHabitsService from './services/getFrequencyForHabits.service';
import GetDataForHeatmapService from './services/getDataForHeatmap.service';
import GetChecksOnIntervalService from './services/getChecksOnInterval.service';
import GetDataForHeatmapOfYearService from './services/getDataForHeatpmarOfYear.service';
import CalculateEstabilityRateService from './services/calculateEstabilityRate.service';
import CalculateEstabilityRateGenerallyService from './services/calculateEsatiblityRateGenerally.service';
@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitDayCheck, User])],
  controllers: [HabitController, HabitDayCheckController],
  providers: [
    CreateHabitService,
    DeleteHabitService,
    ListHabitsService,
    UpdateHabitService,
    ViewHabitService,
    RegisterCheckInHabitService,
    GetCurrentWeekFrequency,
    RemoveCheckInHabitService,
    GetFrequencyForHabitsService,
    GetDataForHeatmapService,
    GetChecksOnIntervalService,
    GetDataForHeatmapOfYearService,
    CalculateEstabilityRateService,
    CalculateEstabilityRateGenerallyService,
  ],
})
export class HabitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(EnsureAuthenticatedMiddleware).forRoutes('*');
  }
}
