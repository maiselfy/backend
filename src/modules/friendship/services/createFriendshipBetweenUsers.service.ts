import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import ICreateFriendshipBetweenUsersDto from '../dtos/ICreateFriendshipBetweenUsersDTO';
import Friendship from '../infra/typeorm/entities/Friendship';

@Injectable()
export default class CreateFriendshipBetweenUsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async execute({
    from_user_id,
    to_user_id,
    status,
  }: ICreateFriendshipBetweenUsersDto): Promise<Friendship> {
    const from_user = await this.usersRepository.findOne({
      where: { id: from_user_id },
    });

    if (!from_user)
      throw new HttpException(
        'It is not possible to perform the operation, the requesting user does not exist',
        HttpStatus.NOT_FOUND,
      );

    const to_user = await this.usersRepository.findOne({
      where: { id: to_user_id },
    });

    if (!to_user)
      throw new HttpException(
        'It is not possible to perform the operation, the requested user does not exist',
        HttpStatus.NOT_FOUND,
      );

    const friendship = this.friendshipRepository.create({
      from_user_id,
      to_user_id,
      status,
    });

    await this.friendshipRepository.save(friendship);

    return friendship;
  }
}
