import { Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import ICreateHabitDTO from '../dtos/ICreateHabitDTO';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';

@Injectable()
export default class UpdateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(
    id: string,
    { name, description, objective, color }: ICreateHabitDTO,
  ): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id: id },
    });

    if (!habit) {
      throw new HttpException(
        'This habit does not exist in the our database.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedHabit = this.habitsRepository.merge(habit, {
      name,
      description,
      objective,
      color,
    });

    await this.habitsRepository.save(updatedHabit);

    return habit;
  }
}
