import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';

import ICreateFriendshipBetweenUsersDTO from '../../dtos/ICreateFriendshipBetweenUsersDTO';

import CreateFriendshipBetweenUsersService from '../../services/createFriendshipBetweenUsers.service';
import ListFriendsOfUserService from '../../services/listFriendsOfUser.service';
import SearchFriendOfUserService from '../../services/searchFriendOfUser.service';
import Friendship from '../typeorm/entities/Friendship';

@Controller('friendship')
@UseInterceptors(ClassSerializerInterceptor)
export default class HabitController {
  constructor(
    private createFriendshipBetweenUsersService: CreateFriendshipBetweenUsersService,
    private listFriendsOfUserService: ListFriendsOfUserService,
    private searchFriendOfUserService: SearchFriendOfUserService,
  ) {}

  @Post()
  createFriendship(
    @Body()
    { from_user_id, to_user_id, status }: ICreateFriendshipBetweenUsersDTO,
  ): Promise<Friendship> {
    return this.createFriendshipBetweenUsersService.execute({
      from_user_id,
      to_user_id,
      status,
    });
  }
  @Get('list/:user_id')
  listFriendsOfUser(@Param('user_id') user_id: string): Promise<User[]> {
    return this.listFriendsOfUserService.execute(user_id);
  }
  @Get('search/:user_id/:name')
  searchBuddy(
    @Param('user_id') user_id: string,
    @Param('name') name: string,
  ): Promise<User[]> {
    return this.searchFriendOfUserService.execute(user_id, name);
  }
}
