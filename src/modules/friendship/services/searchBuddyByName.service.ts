import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class SearchBuddyByNameService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async execute(user_id: string, name: string): Promise<any[]> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, the user does not exist',
          HttpStatus.NOT_FOUND,
        );

      const searchedUsers = await this.usersRepository.find({
        where: [
          {
            name: Like(`%${name}%`),
          },
          {
            lastname: Like(`%${name}%`),
          },
        ],
      });

      if (!(searchedUsers.length > 0)) {
        throw new HttpException(
          'Sorry, no matching results were found, try checking spelling and accenting the name',
          HttpStatus.NOT_FOUND,
        );
      }
      return searchedUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
