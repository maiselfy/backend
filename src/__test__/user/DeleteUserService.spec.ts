import { Test, TestingModule } from '@nestjs/testing';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import DeleteUserService from '../../modules/user/services/deleteUser.service';

describe('Delete User', () => {
  let usersRepository: Repository<User>;
  let deleteUserService: DeleteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
  });

  it('Should be able defined create delete user service', () => {
    expect(deleteUserService).toBeDefined();
  });
});
