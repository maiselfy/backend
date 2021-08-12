import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/infra/typeorm/entities/User';
import Friendship from './infra/typeorm/entities/Friendship';
import FriendshipController from './infra/http/friendship.controller';
import CreateFriendshipBetweenUsersService from './services/createFriendshipBetweenUsers.service';
import ListFriendsOfUserService from './services/listFriendsOfUser.service';

import SearchFriendOfUserService from './services/searchFriendOfUser.service';
import SearchBuddyByNameService from './services/searchBuddyByName.service';
@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User])],
  controllers: [FriendshipController],
  providers: [
    CreateFriendshipBetweenUsersService,
    ListFriendsOfUserService,
    SearchFriendOfUserService,
    SearchBuddyByNameService,
  ],
})
export class FriendshipModule {}
