import { Test, TestingModule } from '@nestjs/testing';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResetPasswordService } from '../../modules/user/services/resetPassword.service';
import UserToken from '../../modules/user/infra/typeorm/entities/UserToken';

describe('Reset Password', () => {
  const userTokenList: Array<UserToken> = [
    new UserToken({
      token: '96070bed-c317-4132-ab3c-2ed4bacc9124',
    }),
  ];

  const userCreatedEntityList: Array<User> = [
    new User({
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe123',
      birthdate: new Date(),
    }),
    new User({
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe1232',
      birthdate: new Date(),
    }),
  ];

  const hashProvider = {
    generateHash: jest
      .fn()
      .mockReturnValue(
        '8A085DFC3E5BEF71F611D372D8C0040E9A525F08B9B53DE9F0804946218E0FB8',
      ),
    compareHash: jest.fn(),
  };

  let tokensRepository: Repository<UserToken>;
  let usersRepository: Repository<User>;
  let resetPasswordService: ResetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        {
          provide: getRepositoryToken(UserToken),
          useValue: {
            findOne: jest.fn().mockReturnValue(userTokenList[0]),
            find: jest.fn().mockReturnValue(userTokenList),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedEntityList[0]),
            merge: jest.fn().mockReturnValue(userCreatedEntityList[1]),
            save: jest.fn().mockReturnValue(userCreatedEntityList[1]),
          },
        },
        { provide: 'BCryptHashProvider', useValue: hashProvider },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokensRepository = module.get<Repository<UserToken>>(
      getRepositoryToken(UserToken),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    resetPasswordService = module.get<ResetPasswordService>(
      ResetPasswordService,
    );
  });

  it('Should be able defined create reset password service', () => {
    expect(resetPasswordService).toBeDefined();
  });

  it('Should be able resert password of user', async () => {
    const result = await resetPasswordService.execute(
      userTokenList[0].token,
      'qwe1232',
      'qwe1232',
    );

    expect(result).toEqual(userCreatedEntityList[1]);
    expect(tokensRepository.findOne).toBeCalledTimes(1);
    expect(tokensRepository.find).toBeCalledTimes(1);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.merge).toBeCalledTimes(1);
    expect(usersRepository.save).toBeCalledTimes(1);
    expect(hashProvider.generateHash).toBeCalledTimes(1);
  });

  it('Should not be able resert password of user, because not exists valid token', async () => {
    jest.spyOn(tokensRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(
      resetPasswordService.execute(
        userTokenList[0].token,
        'qwe1232',
        'qwe1232',
      ),
    ).rejects.toThrowError();
    expect(tokensRepository.findOne).toBeCalledTimes(1);
    expect(tokensRepository.find).toBeCalledTimes(0);
    expect(usersRepository.findOne).toBeCalledTimes(0);
    expect(usersRepository.merge).toBeCalledTimes(0);
    expect(usersRepository.save).toBeCalledTimes(0);
    // expect(hashProvider.generateHash).toBeCalledTimes(0);
  });

  it('Should not be able resert password of user, because the passwords no combine', async () => {
    expect(
      resetPasswordService.execute(userTokenList[0].token, 'abcde', 'qwe1232'),
    ).rejects.toThrowError();
    expect(tokensRepository.findOne).toBeCalledTimes(1);
    // expect(tokensRepository.find).toBeCalledTimes(1);
    // expect(usersRepository.findOne).toBeCalledTimes(1);
    // expect(usersRepository.merge).toBeCalledTimes(0);
    // expect(usersRepository.save).toBeCalledTimes(0);
    // expect(hashProvider.generateHash).toBeCalledTimes(0);
  });
});
