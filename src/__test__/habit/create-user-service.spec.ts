import { Test, TestingModule } from '@nestjs/testing';
import { SendGridModule, SendGridService } from '@ntegral/nestjs-sendgrid';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import CreateUserService from '../../modules/user/services/createUser.service';
import { getRepositoryToken } from '@nestjs/typeorm';

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
        { provide: getRepositoryToken(User), useClass: Repository },
        {
          provide: SendGridService,
          useFactory: jest.fn(() => {
            return '';
          }),
        },
        { provide: 'BCryptHashProvider', useFactory: hashProvider },
      ],
    }).compile();

    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  it('Shold be able defined create user service', () => {
    expect(createUserService).toBeDefined();
  });
});
