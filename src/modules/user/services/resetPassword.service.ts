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
  async execute(token: string, password: string, passwordConfirm: string) {
    try {
      const userToken = await this.userTokensRepository.findOne({
        where: { token },
      });

      if (!userToken) {
        throw new HttpException(
          'This token does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userToken.user_id },
      });

      if (!user) {
        throw new HttpException(
          'The user this token does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const user_tokens = await this.userTokensRepository.find({
        where: { user_id: user.id },
      });

      user_tokens.map(otherToken => {
        if (
          !isAfter(userToken.created_at, otherToken.created_at) &&
          otherToken.token != token
        ) {
          throw new HttpException(
            'This token does not active.',
            HttpStatus.UNAUTHORIZED,
          );
        }
      });

      if (!isAfter(new Date(userToken.expires_in), new Date())) {
        throw new HttpException(
          'This token has expired.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (userToken.used) {
        throw new HttpException(
          'This token was used previously.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (password != passwordConfirm) {
        throw new HttpException(
          'This password does not match.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const passwordHash = await this.HashProvider.generateHash(password);

      const updatedUser = this.userRepository.merge(user, {
        password: passwordHash,
      });

      const updatedUserToken = this.userTokensRepository.merge(userToken, {
        used: true,
      });

      await this.userRepository.save(updatedUser);
      await this.userTokensRepository.save(updatedUserToken);

      return updatedUser;
    } catch (error) {
      if (error) return error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
