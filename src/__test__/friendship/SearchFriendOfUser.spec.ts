import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Friendship from '../../modules/friendship/infra/typeorm/entities/Friendship';
import User from '../../modules/user/infra/typeorm/entities/User';
import SearchFriendOfUserService from '../../modules/friendship/services/searchFriendOfUser.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Search Friends', () => {
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
  let searchFriendsService: SearchFriendOfUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchFriendOfUserService,
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

    searchFriendsService = module.get<SearchFriendOfUserService>(
      SearchFriendOfUserService,
    );
  });

  it('Should be able defined create search friends service', () => {
    expect(searchFriendsService).toBeDefined();
  });

  it('Should be able list all friends of current user', async () => {
    const data = 'user_idfield';
    const data_2 = 'namefield';

    const result = await searchFriendsService.execute(data, data_2);

    expect(result).toEqual(friendshipCreatedList);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.find).toBeCalledTimes(1);
  });

  it('Should not be able list all friends of current user, because current user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data = 'user_idfield';
    const data_2 = 'namefield';

    expect(searchFriendsService.execute(data, data_2)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(friendshipRepository.find).toBeCalledTimes(0);
  });
});
