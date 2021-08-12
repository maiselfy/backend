import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class SearchFriendOfUserService {
  friends: any[];

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async execute(user_id: string, name: string): Promise<any[]> {
    this.friends = [];
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, the user does not exist',
          HttpStatus.NOT_FOUND,
        );

      const all_friends = await this.friendshipRepository.find({
        where: [
          {
            from_user_id: user_id,
            status: 'ACCEPTED',
          },
          {
            to_user_id: user_id,
            status: 'ACCEPTED',
          },
        ],
        relations: ['fromUser', 'toUser'],
      });

      //Usar o includes.

      all_friends.forEach(friend => {
        if (
          friend.toUser.name.toLowerCase().includes(name.toLowerCase()) ===
            true ||
          friend.fromUser.name.toLowerCase().includes(name.toLowerCase()) ===
            true ||
          friend.toUser.lastname.toLowerCase().includes(name.toLowerCase()) ===
            true ||
          friend.fromUser.lastname
            .toLowerCase()
            .includes(name.toLowerCase()) === true
        ) {
          this.friends.push(friend);
        }
      });
      return this.friends;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
