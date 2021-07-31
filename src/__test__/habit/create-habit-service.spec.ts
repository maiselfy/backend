import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Habit from '../../modules/habit/infra/typeorm/entities/Habit';
import CreateHabitService from '../../modules/habit/services/createHabit.service';
import User from '../../modules/user/infra/typeorm/entities/User';
import ICreateUserDTO from '../../modules/user/dtos/ICreateUserDTO';

const habitEntityList = [
  new Habit({
    user_id: '1234',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
  }),
];

const userEntityList = [
  new User({
    name: 'namefield2',
    username: 'usernamefield2',
    lastname: 'lastnamefield2',
    email: 'emailfail2@gmail.com',
    password: 'qwe1232',
    birthdate: new Date(),
  }),
];

describe('create habit', () => {
  let habitService: CreateHabitService;
  let userRepository: Repository<User>;
  let habitRepository: Repository<Habit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            create: jest.fn().mockReturnValue(habitEntityList),
            save: jest.fn().mockResolvedValue(habitEntityList), //confirmando que ele ta sendo salvo, mas ele ja tava criado em algum lugar
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntityList),
          },
        },
      ],
    }).compile();

    habitService = module.get<CreateHabitService>(CreateHabitService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
  });

  it('should be defined', async () => {
    expect(habitService).toBeDefined();
  });

  it('should be able to create a new habit', async () => {
    const user: ICreateUserDTO = {
      name: 'namefield',
      username: 'usernamefield',
      lastname: 'lastnamefield',
      email: 'emailfield@gmail.com',
      password: 'qwe123',
      birthdate: new Date(),
    };

    const savedUser = userRepository.create(user);
  });
});
