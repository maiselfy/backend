import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Friendship from '../../../modules/friendship/infra/typeorm/entities/Friendship';
import User from '../../../modules/user/infra/typeorm/entities/User';
import CreateFriendshipBetweenUsersService from '../../../modules/friendship/services/createFriendshipBetweenUsers.service';
import ICreateFriendshipBetweenUsersDTO from '../../../modules/friendship/dtos/ICreateFriendshipBetweenUsersDTO';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Create Friendship', () => {
  const userCreated: User = {
    id: 'idfield',
    email: 'emailfield',
    password: 'passwordfield',
    name: 'namefield',
    lastname: 'lastnamefield',
    username: 'usernamefield',
    birthdate: new Date(),
    bodies: [],
    avatar: 'avatarfield',
    created_at: new Date(),
    updated_at: new Date(),
    fullName: 'fullNamefield',
  };

  const friendshipCreated: Friendship = {
    id: 'idfield',
    from_user_id: 'from_user_idfield',
    to_user_id: 'to_user_idfield',
    status: 'statusfield',
    created_at: new Date(),
    updated_at: new Date(),
    fromUser: userCreated,
    toUser: userCreated,
  };

  let usersRepository: Repository<User>;
  let friendshipRepository: Repository<Friendship>;
  let createFriendshipService: CreateFriendshipBetweenUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFriendshipBetweenUsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreated),
          },
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            create: jest.fn().mockReturnValue(friendshipCreated),
            save: jest.fn().mockReturnValue(friendshipCreated),
          },
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    friendshipRepository = module.get<Repository<Friendship>>(
      getRepositoryToken(Friendship),
    );

    createFriendshipService = module.get<CreateFriendshipBetweenUsersService>(
      CreateFriendshipBetweenUsersService,
    );
  });

  it('Should be able defined create friendship service', () => {
    expect(createFriendshipService).toBeDefined();
  });

  it('Should be able create friendship in habit', async () => {
    const data: ICreateFriendshipBetweenUsersDTO = {
      from_user_id: 'from_user_idfield',
      to_user_id: 'to_user_idfield',
      status: 'statusfield',
    };

    const result = await createFriendshipService.execute(data);

    expect(result).toEqual(friendshipCreated);
    expect(usersRepository.findOne).toBeCalledTimes(2);
    expect(friendshipRepository.create).toBeCalledTimes(1);
    expect(friendshipRepository.save).toBeCalledTimes(1);
  });

  it('Should not be able create friendship, because user friend not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateFriendshipBetweenUsersDTO = {
      from_user_id: 'from_user_idfield',
      to_user_id: 'to_user_idfield',
      status: 'statusfield',
    };

    expect(createFriendshipService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.create).toBeCalledTimes(0);
    expect(friendshipRepository.save).toBeCalledTimes(0);
  });

  it('Should not be able create friendship, because ocurred error in server', async () => {
    jest.spyOn(friendshipRepository, 'save').mockRejectedValueOnce(new Error());

    const data: ICreateFriendshipBetweenUsersDTO = {
      from_user_id: 'from_user_idfield',
      to_user_id: 'to_user_idfield',
      status: 'statusfield',
    };

    expect(createFriendshipService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.create).toBeCalledTimes(0);
    expect(friendshipRepository.save).toBeCalledTimes(0);
  });
});
