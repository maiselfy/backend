import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UserToken from '../infra/typeorm/entities/UserToken';
import { addDays } from 'date-fns';
import * as path from 'path';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendEmailWithTokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokensRepository: Repository<UserToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        'This user does not exist in the our database.',
        HttpStatus.NOT_FOUND,
      );
    }

    let userToken = await this.userTokensRepository.findOne({
      where: { user_id: user.id },
    });

    if (userToken) {
      const id = userToken.id;
      await this.userTokensRepository.delete(id);
    }

    const expires_in = addDays(new Date(), 7);

    userToken = this.userTokensRepository.create({
      user_id: user.id,
      expires_in,
    });

    await this.userTokensRepository.save(userToken);

    const mail = {
      to: user.email,
      from: 'noreply@maiself.com',
      subject: 'Email de confirmação',
      template: path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'templates',
        'recover-password',
      ),
      context: {
        token: userToken.token,
      },
    };

    await this.mailerService.sendMail(mail);
  }
}
