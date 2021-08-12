import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class SearchBuddyByNameService {
  searchedUsers: any[];

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(user_id: string, name: string): Promise<any[]> {
    this.searchedUsers = [];
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, the user does not exist',
          HttpStatus.NOT_FOUND,
        );

      const users = await this.usersRepository.find();

      users.forEach(user => {
        if (
          user.fullName.toLowerCase().includes(name.toLowerCase()) ||
          user.lastname.toLowerCase().includes(name.toLowerCase())
        ) {
          this.searchedUsers.push(user);
        }
      });

      return this.searchedUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
