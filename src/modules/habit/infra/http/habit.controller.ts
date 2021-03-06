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
import { Habit as HabitDecorator } from '../decorators/habit.decorator';
import ICreateHabitDTO from '../../dtos/ICreateHabitDTO';
import CreateHabitService from '../../services/createHabit.service';
import UpdateHabitService from '../../services/updateHabit.service';
import DeleteHabitService from '../../services/deleteHabit.service';
import ListHabitsService from '../../services/listHabits.service';
import ViewHabitService from '../../services/viewHabit.service';
import IUpdateHabitDTO from '../../dtos/IUpdateHabitDTO';
import GetCurrentWeekFrequency from '../../services/getCurrentWeekFrequency.service';

@Controller('habit')
export default class HabitController {
  constructor(
    private createHabitService: CreateHabitService,
    private updateHabitService: UpdateHabitService,
    private deleteHabitService: DeleteHabitService,
    private listHabitsService: ListHabitsService,
    private viewHabitService: ViewHabitService,
    private getCurrentWeekFrequency: GetCurrentWeekFrequency,
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
  @Put('edit/:id/:user_id')
  updateHabit(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Body() { name, description, objective, color, buddy_id }: IUpdateHabitDTO,
  ): Promise<Habit> {
    return this.updateHabitService.execute(id, user_id, {
      name,
      description,
      objective,
      color,
      buddy_id,
    });
  }

  @Delete('delete/:id/:user_id')
  async deleteHabit(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.deleteHabitService.execute(id, user_id);
    return res
      .status(204)
      .json({ message: 'Habit has been deleted.' })
      .send();
  }

  @Get('list/:id')
  async listHabitsForUser(@Param('id') id: string): Promise<any> {
    const habits = await this.listHabitsService.execute(id);
    return Promise.all(
      habits.map(async (habit: Habit) => {
        const currentWeekFrequency = await this.getCurrentWeekFrequency.execute(
          {
            habitId: habit.id,
            userId: id,
          },
        );

        let numDaysChecked = 0;
        const stabilityChartData = [];

        for (const frequency in currentWeekFrequency) {
          if (currentWeekFrequency[frequency].checked === true) {
            numDaysChecked += 1;
            stabilityChartData.push(1);
          } else {
            stabilityChartData.push(0);
          }
        }

        const stabilityAverage = (numDaysChecked / 7) * 100;

        return {
          ...habit,
          currentWeekFrequency,
          stability: {
            avg: stabilityAverage.toFixed(2),
            stabilityChartData,
          },
        };
      }),
    );
  }

  @Get('retrieve/:user_id/:id')
  viewHabitOfUser(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
  ): Promise<Habit> {
    return this.viewHabitService.execute(id, user_id);
  }
}
