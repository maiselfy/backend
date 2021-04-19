import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUpdateHabitDTO from '../dtos/IUpdateHabitDTO';
import Habit from '../infra/typeorm/entities/Habit';

@Injectable()
export default class UpdateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}

  async execute(
    id: string,
    {
      name,
      description,
      reminderQuestion,
      color,
      frequency,
      reminder,
      pontuation,
    }: IUpdateHabitDTO,
  ): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({ where: { id } });
    if (!habit) {
      throw new HttpException(
        'There is no corresponding habit registered for this user.',
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedHabit = this.habitsRepository.merge(habit, {
      name,
      description,
      reminderQuestion,
      color,
      frequency,
      reminder,
      pontuation,
    });

    await this.habitsRepository.save(updatedHabit);

    return updatedHabit;
  }
}
