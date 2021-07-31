import { Test, TestingModule } from '@nestjs/testing';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import DeleteUserService from '../../modules/user/services/deleteUser.service';
import ICreateUserDTO from '../../modules/user/dtos/ICreateUserDTO';

describe('Delete User', () => {
  const userCreatedEntity: ICreateUserDTO = {
    name: 'namefield',
    username: 'usernamefield',
    lastname: 'lastnamefield',
    email: 'emailfield@gmail.com',
    password: 'qwe123',
    birthdate: new Date(),
  };

  const successfulDelete = {
    raw: 0,
    affected: 1,
  };

  let usersRepository: Repository<User>;
  let deleteUserService: DeleteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedEntity),
            delete: jest.fn().mockReturnValue(successfulDelete),
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

  it('Should be able delete user', async () => {
    const result = await deleteUserService.execute('1');

    expect(result).toEqual(true);
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('Should be not able delete user', async () => {
    successfulDelete.raw = 1;
    successfulDelete.affected = 0;

    jest
      .spyOn(usersRepository, 'delete')
      .mockResolvedValueOnce(successfulDelete);
    const result = await deleteUserService.execute('123');

    expect(result).toEqual(false);
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.delete).toHaveBeenCalledTimes(1);

    successfulDelete.raw = 0;
    successfulDelete.affected = 1;
  });

  it('Should be not able delete user, because user not exists, action throws exception', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(deleteUserService.execute('123')).rejects.toThrowError();
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.delete).toHaveBeenCalledTimes(0);
  });
});
