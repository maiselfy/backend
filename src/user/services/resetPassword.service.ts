import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UserToken from '../infra/typeorm/entities/UserToken';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { isAfter } from 'date-fns';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(UserToken)
    private userTokensRepository: Repository<UserToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
  ) {}
  async execute(token: string, password: string) {
    const userToken = await this.userTokensRepository.findOne({
      where: { token },
    });

    if (!userToken) {
      throw new HttpException(
        'This token does not exist in the our database.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!isAfter(new Date(userToken.expires_in), new Date())) {
      throw new HttpException(
        'This token has expired.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userToken.user_id },
    });

    const passwordHash = await this.HashProvider.generateHash(password);

    const updatedUser = this.userRepository.merge(user, {
      password: passwordHash,
    });

    await this.userRepository.save(updatedUser);

    return updatedUser;
  }
}
