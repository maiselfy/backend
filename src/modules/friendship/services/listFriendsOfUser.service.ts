import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import ICreateFriendshipBetweenUsersDto from '../dtos/ICreateFriendshipBetweenUsersDTO';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class ListFriendsOfUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async execute({ user_id }): Promise<User[]> {
    let friends: User[];

    const from_user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!from_user)
      throw new HttpException(
        'It is not possible to perform the operation, the user does not exist',
        HttpStatus.NOT_FOUND,
      );

    const all_friends = await this.friendshipRepository.find({
      where: [
        { from_user_id: user_id, status: 'Accepted' },
        { to_user_id: user_id, status: 'Accepted' },
      ],
    });

    for (const friend of all_friends) {
      friends = await this.usersRepository.find({
        where: [{ id: friend.from_user_id }, { id: friend.to_user_id }],
      });
    }

    const haveFriends = friends.length;

    if (haveFriends === 0 || null) {
      throw new HttpException(
        'Sorry you do not have friends assigned to your habits',
        HttpStatus.NOT_FOUND,
      );
    }

    return friends;
  }
}
