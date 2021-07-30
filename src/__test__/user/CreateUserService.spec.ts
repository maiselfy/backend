import { Test, TestingModule } from '@nestjs/testing';
import { SendGridModule, SendGridService } from '@ntegral/nestjs-sendgrid';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import CreateUserService from '../../modules/user/services/createUser.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateUserDTO from '../../modules/user/dtos/ICreateUserDTO';

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
    email: 'emailfail2@gmail.com',
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

describe('Create User', () => {
  let usersRepository: Repository<User>;
  let createUserService: CreateUserService;

  const hashProvider = () => {
    return {
      generateHash: jest.fn(),
      compareHash: jest.fn(),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apiKey: 'SG.apifake',
        }),
      ],
      providers: [
        CreateUserService,
        SendGridService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(userCreatedEntityList[0]),
            save: jest.fn().mockResolvedValue(userCreatedEntityList[0]),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
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
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should be not able create user', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValue(new Error());
    const data: ICreateUserDTO = {
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe123',
      birthdate: new Date(),
    };

    expect(createUserService.execute(data)).rejects.toThrowError();
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.create).toHaveBeenCalledTimes(0);
    expect(usersRepository.save).toHaveBeenCalledTimes(0);
  });
});
