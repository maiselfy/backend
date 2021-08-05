import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UserToken from '../infra/typeorm/entities/UserToken';
import { addDays } from 'date-fns';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class SendEmailWithTokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokensRepository: Repository<UserToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectSendGrid() private readonly sendgrid: SendGridService,
  ) {}

  async execute(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new HttpException(
          'This email does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      let userToken = await this.userTokensRepository.findOne({
        where: { user_id: user.id },
      });

      const expires_in = addDays(new Date(), 7);

      userToken = this.userTokensRepository.create({
        user_id: user.id,
        expires_in,
      });

      await this.userTokensRepository.save(userToken);
      await this.sendgrid.send({
        to: user.email,
        from: 'no-reply@maiself.com.br',
        subject: 'Maiself - Alteração de senha',
        templateId: 'd-cb35dfd58fb7480f86cfa62ec1687d83',
        dynamicTemplateData: { token: userToken.token },
      });

      return userToken;
    } catch (error) {
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
