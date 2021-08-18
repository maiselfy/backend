import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Friendship from '../../../modules/friendship/infra/typeorm/entities/Friendship';
import User from '../../../modules/user/infra/typeorm/entities/User';
import ListFriendsOfUserService from '../../../modules/friendship/services/listFriendsOfUser.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('List Friends', () => {
  const userCreatedList: Array<User> = [
    {
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
    },
    {
      id: 'idfield2',
      email: 'emailfield2',
      password: 'passwordfield2',
      name: 'namefield2',
      lastname: 'lastnamefield2',
      username: 'usernamefield2',
      birthdate: new Date(),
      bodies: [],
      avatar: 'avatarfield2',
      created_at: new Date(),
      updated_at: new Date(),
      fullName: 'fullNamefield2',
    },
  ];

  const friendshipCreatedList: Array<Friendship> = [
    {
      id: 'idfield',
      from_user_id: 'from_user_idfield',
      to_user_id: 'to_user_idfield',
      status: 'statusfield',
      created_at: new Date(),
      updated_at: new Date(),
      fromUser: userCreatedList[0],
      toUser: userCreatedList[0],
    },
    {
      id: 'idfield2',
      from_user_id: 'from_user_idfield2',
      to_user_id: 'to_user_idfield2',
      status: 'statusfield2',
      created_at: new Date(),
      updated_at: new Date(),
      fromUser: userCreatedList[1],
      toUser: userCreatedList[1],
    },
  ];

  let usersRepository: Repository<User>;
  let friendshipRepository: Repository<Friendship>;
  let listFriendshipService: ListFriendsOfUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFriendsOfUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedList[0]),
          },
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            find: jest.fn().mockReturnValue(friendshipCreatedList),
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

    listFriendshipService = module.get<ListFriendsOfUserService>(
      ListFriendsOfUserService,
    );
  });

  it('Should be able defined create friendship service', () => {
    expect(listFriendshipService).toBeDefined();
  });

  it('Should be able list friend to user current', async () => {
    const data = 'user_idfield';

    const result = await listFriendshipService.execute(data);

    expect(result).toEqual(friendshipCreatedList);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.find).toBeCalledTimes(1);
  });

  it('Should not be able list friend to user current, becuase user current not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());
    const data = 'user_idfield';

    expect(listFriendshipService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.find).toBeCalledTimes(0);
  });

  it('Should not be able list friend to user current, becuase friends to current not exists', async () => {
    jest.spyOn(friendshipRepository, 'find').mockRejectedValueOnce(new Error());
    const data = 'user_idfield';

    expect(listFriendshipService.execute(data)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.find).toBeCalledTimes(0);
  });
});
