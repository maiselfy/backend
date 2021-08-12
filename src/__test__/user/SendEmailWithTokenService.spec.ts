import { Test, TestingModule } from '@nestjs/testing';
import { SendGridModule, SendGridService } from '@ntegral/nestjs-sendgrid';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserToken from '../../modules/user/infra/typeorm/entities/UserToken';
import { SendEmailWithTokenService } from '../../modules/user/services/sendEmailWithToken.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Send Email', () => {
  const userCreatedEntity: User = new User({
    name: 'namefield',
    username: 'usernamefield',
    lastname: 'lastnamefield',
    email: 'emailfield@gmail.com',
    password: 'qwe123',
    birthdate: new Date(),
  });

  const userTokenList: UserToken = new UserToken({
    token: '96070bed-c317-4132-ab3c-2ed4bacc9124',
  });

  const emailCreateUserSend = {
    to: userCreatedEntity.email,
    from: 'no-reply@maiself.com.br',
    subject: 'Maiself - Alteração de senha',
    templateId: 'd-cb35dfd58fb7480f86cfa62ec1687d83',
    dynamicTemplateData: { token: userTokenList.token },
  };

  let tokensRepository: Repository<UserToken>;
  let usersRepository: Repository<User>;
  let sendEmailService: SendEmailWithTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apiKey:
            'SG.J8xI-wBDSc2eP-m0Cal9Gw.wmeCNr-O95f6j-DdM8q2994dTkVBrslj2n1Gn6XS_A',
        }),
      ],
      providers: [
        SendEmailWithTokenService,
        {
          provide: getRepositoryToken(UserToken),
          useValue: {
            findOne: jest.fn().mockReturnValue(userTokenList),
            create: jest.fn().mockReturnValue(userTokenList),
            save: jest.fn().mockReturnValue(userTokenList),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedEntity),
          },
        },
        {
          provide: SendGridService,
          useValue: {
            send: jest.fn().mockReturnValue(emailCreateUserSend),
          },
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokensRepository = module.get<Repository<UserToken>>(
      getRepositoryToken(UserToken),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    sendEmailService = module.get<SendEmailWithTokenService>(
      SendEmailWithTokenService,
    );
  });

  it('Should be able defined create user service', () => {
    expect(sendEmailService).toBeDefined();
  });

  it('Should be able send email', async () => {
    const email = userCreatedEntity.email;

    const result = await sendEmailService.execute(email);

    expect(result).toEqual(userTokenList);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(tokensRepository.findOne).toBeCalledTimes(1);
    expect(tokensRepository.create).toBeCalledTimes(1);
    expect(tokensRepository.save).toBeCalledTimes(1);
  });

  it('Should not be able send email, because user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const email = userCreatedEntity.email;

    expect(sendEmailService.execute(email)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(tokensRepository.findOne).toBeCalledTimes(0);
    expect(tokensRepository.create).toBeCalledTimes(0);
    expect(tokensRepository.save).toBeCalledTimes(0);
  });
});
