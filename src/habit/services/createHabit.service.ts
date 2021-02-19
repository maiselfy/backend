import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ICreateHabitDTO from '../dtos/ICreateHabitDTO';
import Habit from '../infra/typeorm/entities/Habit';

@Injectable()
export default class CreateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
  ) {}
  async execute({
    name,
    description,
    reminderQuestion,
    color,
    frequency,
    reminder,
    pontuation,
  }: ICreateHabitDTO): Promise<Habit> {
    const habit = this.habitsRepository.create({
      name,
      description,
      reminderQuestion,
      color,
      frequency,
      reminder,
      pontuation,
    });
    await this.habitsRepository.save(habit);
    return habit;
  }
}
