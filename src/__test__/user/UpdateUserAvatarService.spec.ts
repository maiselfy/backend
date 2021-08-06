import { Test, TestingModule } from '@nestjs/testing';
import User from '../../modules/user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import IUpdateUserDTO from '../../modules/user/dtos/IUpdateUserDTO.interface';
import UpdateUserAvatarService from '../../modules/user/services/updateUserAvatar.service';

describe('Update Avatar', () => {
  interface Request {
    userId: string;
    avatarFilename: string;
  }

  const userUpdate: IUpdateUserDTO | User = {
    name: 'namefield',
    lastname: 'lastnamefield',
    username: 'usernamefield',
    email: 'emailfield@gmail.com',
    password: 'passwordfield',
    birthdate: new Date(),
  };

  let usersRepository: Repository<User>;
  let updateUserAvatarService: UpdateUserAvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserAvatarService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userUpdate),
            save: jest.fn().mockReturnValue(userUpdate),
          },
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserAvatarService = module.get<UpdateUserAvatarService>(
      UpdateUserAvatarService,
    );
  });

  it('Should be able defined create update avatar service', () => {
    expect(updateUserAvatarService).toBeDefined();
  });

  it('Should be able update user avatar', async () => {
    const data: Request = {
      userId: '1',
      avatarFilename: 'src/__test__/user/UpdateUserAvatarService.spec.ts',
    };

    const result = await updateUserAvatarService.execute(data);

    expect(result).toEqual(userUpdate);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.save).toBeCalledTimes(1);
  });

  it('Should not be able update user avatar, because user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: Request = {
      userId: '1',
      avatarFilename: 'src/__test__/user/UpdateUserAvatarService.spec.ts',
    };

    expect(updateUserAvatarService.execute(data)).rejects.toThrowError();
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.save).toBeCalledTimes(0);
  });
});
