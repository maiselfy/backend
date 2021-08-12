import { Test, TestingModule } from '@nestjs/testing';
import { SendGridModule, SendGridService } from '@ntegral/nestjs-sendgrid';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import CreateUserService from '../../modules/user/services/createUser.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateUserDTO from '../../modules/user/dtos/ICreateUserDTO';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Create User', () => {
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
      name: 'namefield2',
      username: 'usernamefield2',
      lastname: 'lastnamefield2',
      email: 'emailfield2@gmail.com',
      password: 'qwe1232',
      birthdate: new Date(),
    }),
  ];

  const emailCreateUserSend = {
    to: userCreatedEntityList[0].email,
    from: 'no-reply@maiself.com.br',
    subject: 'Welcome to Maiself',
    templateId: 'd-edce0598398f458692d26ae47ae5dbda',
    dynamicTemplateData: {
      first_name: userCreatedEntityList[0].name,
    },
  };

  const hashProvider = () => {
    return {
      generateHash: jest
        .fn()
        .mockReturnValue(
          '8A085DFC3E5BEF71F611D372D8C0040E9A525F08B9B53DE9F0804946218E0FB8',
        ),
      compareHash: jest.fn(),
    };
  };

  let usersRepository: Repository<User>;
  let createUserService: CreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apiKey:
            'SG.J8xI-wBDSc2eP-m0Cal9Gw.wmeCNr-O95f6j-DdM8q2994dTkVBrslj2n1Gn6XS_A',
        }),
      ],
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(userCreatedEntityList[0]),
            save: jest.fn().mockResolvedValue(userCreatedEntityList[0]),
          },
        },
        {
          provide: SendGridService,
          useValue: {
            send: jest.fn().mockResolvedValue(emailCreateUserSend),
          },
        },
        { provide: 'BCryptHashProvider', useFactory: hashProvider },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  it('Should be able defined create user service', () => {
    expect(createUserService).toBeDefined();
  });

  it('Should be able create user', async () => {
    const data: ICreateUserDTO = {
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe123',
      birthdate: new Date(),
    };

    const result = await createUserService.execute(data);

    expect(result).toEqual(userCreatedEntityList[0]);
    expect(usersRepository.create).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).toHaveBeenCalledTimes(1);
    expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
  });

  it('Should not be able create user what exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateUserDTO = {
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe123',
      birthdate: new Date(),
    };

    expect(createUserService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.create).toHaveBeenCalledTimes(0);
    expect(usersRepository.save).toHaveBeenCalledTimes(0);
  });

  it('Should be able create other user', async () => {
    jest
      .spyOn(usersRepository, 'create')
      .mockReturnValueOnce(userCreatedEntityList[1]);

    jest
      .spyOn(usersRepository, 'save')
      .mockResolvedValueOnce(userCreatedEntityList[1]);

    const data: ICreateUserDTO = {
      name: 'namefield2',
      username: 'usernamefield2',
      lastname: 'lastnamefield2',
      email: 'emailfield2@gmail.com',
      password: 'qwe1232',
      birthdate: new Date(),
    };

    const result = await createUserService.execute(data);

    expect(result).toEqual(userCreatedEntityList[1]);
    expect(usersRepository.create).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).toHaveBeenCalledTimes(1);
    expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
  });

  it('Should not be able create other user what exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateUserDTO = {
      name: 'namefield2',
      username: 'usernamefield2',
      lastname: 'lastnamefield2',
      email: 'emailfield2@gmail.com',
      password: 'qwe1232',
      birthdate: new Date(),
    };

    expect(createUserService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.create).toHaveBeenCalledTimes(0);
    expect(usersRepository.save).toHaveBeenCalledTimes(0);
  });
});
