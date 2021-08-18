import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Friendship from '../../../modules/friendship/infra/typeorm/entities/Friendship';
import User from '../../../modules/user/infra/typeorm/entities/User';
import SearchBuddyByNameService from '../../../modules/friendship/services/searchBuddyByName.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Search Buddys', () => {
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

  let usersRepository: Repository<User>;
  let friendshipRepository: Repository<Friendship>;
  let searchBuddyByNameService: SearchBuddyByNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchBuddyByNameService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userCreatedList[0]),
            find: jest.fn().mockReturnValue(userCreatedList),
          },
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: {},
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    friendshipRepository = module.get<Repository<Friendship>>(
      getRepositoryToken(Friendship),
    );

    searchBuddyByNameService = module.get<SearchBuddyByNameService>(
      SearchBuddyByNameService,
    );
  });

  it('Should be able defined create search buddy name service', () => {
    expect(searchBuddyByNameService).toBeDefined();
  });

  it('Should be able return list users with the name required', async () => {
    const data = 'user_idfield';
    const data_2 = 'namefield';

    const result = await searchBuddyByNameService.execute(data, data_2);

    expect(result).toEqual(userCreatedList);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.find).toBeCalledTimes(1);
  });

  it('Should not be able return list users with the name required, with user not exists', async () => {
    jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data = 'user_idfield';
    const data_2 = 'namefield';

    expect(searchBuddyByNameService.execute(data, data_2)).rejects.toEqual(
      new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(usersRepository.find).toBeCalledTimes(0);
  });
});
