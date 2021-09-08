import { Repository } from 'typeorm';
import Habit from '../infra/typeorm/entities/Habit';
import { InjectRepository } from '@nestjs/typeorm';
import ICreateHabitDTO from '../dtos/ICreateHabitDTO';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from '../../user/infra/typeorm/entities/User';

@Injectable()
export default class CreateHabitService {
  constructor(
    @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute({
    user_id,
    name,
    description,
    objective,
    color,
    buddy_id,
  }: ICreateHabitDTO): Promise<Habit> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );

      const habit = this.habitsRepository.create({
        user_id,
        name,
        description,
        objective,
        color,
        buddy_id,
      });

      await this.habitsRepository.save(habit);

      return habit;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
