import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Habit from './infra/typeorm/entities/Habit';
import HabitDayCheck from './infra/typeorm/entities/HabitDayCheck';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitDayCheck])],
})
export class HabitModule {}
