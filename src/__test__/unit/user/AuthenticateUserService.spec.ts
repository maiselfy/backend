import { Test, TestingModule } from '@nestjs/testing';
import User from '../../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import AuthenticateUserService from '../../../modules/user/services/authenticateUser.service';
import { JwtService } from '@nestjs/jwt';
import { ICreateSessionDTO } from '../../../modules/user/dtos/ICreateSessionDTO';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Authenticate User', () => {
  const userCreatedSession: ICreateSessionDTO = {
    email: 'emailfield@gmail.com',
    password: 'qwe123',
  };

  const returnJwtSession = {
    id: '1',
    name: 'namefield',
    lastname: 'lastnamefield',
    email: 'emailfield@gmail.com',
  };

  const hashProvider = {
    generateHash: jest
      .fn()
      .mockReturnValue(
        '8A085DFC3E5BEF71F611D372D8C0040E9A525F08B9B53DE9F0804946218E0FB8',
      ),
    compareHash: jest.fn().mockReturnValue(true),
  };

  const jwtService = {
    sign: jest.fn().mockReturnValue(returnJwtSession),
  };

  let usersRepository: Repository<User>;
  let authenticateUserService: AuthenticateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedSession),
          },
        },
        { provide: 'BCryptHashProvider', useValue: hashProvider },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authenticateUserService = module.get<AuthenticateUserService>(
      AuthenticateUserService,
    );
  });

  it('Should be able defined create authenticate user service', async () => {
    expect(authenticateUserService).toBeDefined();
  });

  it('Should be able create session with email and password valid', async () => {
    const result = await authenticateUserService.execute(userCreatedSession);

    expect(result).toEqual(returnJwtSession);
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
  });

  it('Should not be able create session, because user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(authenticateUserService.execute(userCreatedSession)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );

    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should not be able create session, because password no combine whit the of data base', async () => {
    hashProvider.compareHash.mockReturnValueOnce(false);

    expect(authenticateUserService.execute(userCreatedSession)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  });
});
