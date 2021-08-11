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

  async execute(user_id: string): Promise<any[]> {
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
        relations: ['fromUser', 'toUser'],
      });

      return all_friends;
    } catch {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
