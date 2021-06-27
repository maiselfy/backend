import { Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import IUpdateHabitDTO from '../dtos/IUpdateHabitDTO';

@Injectable()
export default class UpdateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(
    id: string,
    { name, description, objective, color, buddy_id }: IUpdateHabitDTO,
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

    const buddyExists = this.usersRepository.findOne({
      where: { id: buddy_id },
    });

    if (!buddyExists) {
      throw new HttpException(
        'It is not possible to assign this habit to this buddy, as there is no corresponding user.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedHabit = this.habitsRepository.merge(habit, {
      name,
      description,
      objective,
      color,
      buddy_id,
    });

    await this.habitsRepository.save(updatedHabit);

    return habit;
  }
}
