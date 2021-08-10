import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class ListFriendsOfUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async execute(user_id: string): Promise<User[]> {
    try {
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
          { from_user_id: user_id, status: 'ACCEPTED' },
          { to_user_id: user_id, status: 'ACCEPTED' },
        ],
      });

      for (const friend of all_friends) {
        friends = await this.usersRepository.find({
          where: [{ id: friend.from_user_id }, { id: friend.to_user_id }],
        });
      }

      friends.forEach(friend => {
        if (friend.id === user_id) {
          friends.splice(friends.indexOf(friend), 1);
        }
      });

      if (!(friends.length > 0)) {
        throw new HttpException(
          'Sorry, this user has no registered friendships',
          HttpStatus.NOT_FOUND,
        );
      }

      return friends;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
