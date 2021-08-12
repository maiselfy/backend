import { Test, TestingModule } from '@nestjs/testing';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import UpdateUserService from '../../modules/user/services/updateUser.service';
import IUpdateUserDTO from '../../modules/user/dtos/IUpdateUserDTO.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Update User', () => {
  const userUpdate: IUpdateUserDTO | User = {
    name: 'namefield',
    lastname: 'lastnamefield',
    username: 'usernamefield',
    email: 'emailfield@gmail.com',
    password: 'passwordfield',
    birthdate: new Date(),
  };

  const userUpdated: IUpdateUserDTO | User = {
    name: 'namefield2',
    lastname: 'lastnamefield2',
    username: 'usernamefield2',
    email: 'emailfield2@gmail.com',
    password: 'passwordfield',
    birthdate: new Date(),
  };

  const hashProvider = {
    generateHash: jest
      .fn()
      .mockReturnValue(
        '8A085DFC3E5BEF71F611D372D8C0040E9A525F08B9B53DE9F0804946218E0FB8',
      ),
    compareHash: jest.fn().mockReturnValue(true),
  };

  let usersRepository: Repository<User>;
  let updateUserService: UpdateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userUpdate),
            merge: jest.fn().mockReturnValue(userUpdated),
            save: jest.fn().mockReturnValue(userUpdated),
          },
        },
        { provide: 'BCryptHashProvider', useValue: hashProvider },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
  });

  it('Should be able defined create update user service', () => {
    expect(updateUserService).toBeDefined();
  });

  it('Should be able update user', async () => {
    const data: IUpdateUserDTO | User = {
      name: 'namefield2',
      lastname: 'lastnamefield2',
      username: 'usernamefield',
      email: 'emailfield@gmail.com',
      password: 'passwordfield',
      birthdate: new Date(),
    };

    const result = await updateUserService.execute('1', data);

    expect(result).toEqual(userUpdated);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.merge).toBeCalledTimes(1);
    expect(usersRepository.save).toBeCalledTimes(1);
  });

  it('Should not be able update user, because user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: IUpdateUserDTO | User = {
      name: 'namefield2',
      lastname: 'lastnamefield2',
      username: 'usernamefield',
      email: 'emailfield2@gmail.com',
      password: 'passwordfield',
      birthdate: new Date(),
    };

    expect(updateUserService.execute('1', data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.merge).toBeCalledTimes(0);
    expect(usersRepository.save).toBeCalledTimes(0);
  });
});
