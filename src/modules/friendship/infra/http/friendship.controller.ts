import { Body, Controller, Post } from '@nestjs/common';

import ICreateFriendshipBetweenUsersDTO from '../../dtos/ICreateFriendshipBetweenUsersDTO';

import CreateFriendshipBetweenUsersService from '../../services/createFriendshipBetweenUsers.service';
import Friendship from '../typeorm/entities/Friendship';

@Controller('friendship')
export default class HabitController {
  constructor(
    private createFriendshipBetweenUsersService: CreateFriendshipBetweenUsersService,
  ) {}

  @Post()
  createHabit(
    @Body()
    { from_user_id, to_user_id, status }: ICreateFriendshipBetweenUsersDTO,
  ): Promise<Friendship> {
    return this.createFriendshipBetweenUsersService.execute({
      from_user_id,
      to_user_id,
      status,
    });
  }
}
