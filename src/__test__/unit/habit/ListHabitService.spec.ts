import { Test, TestingModule } from '@nestjs/testing';
import ListHabitsService from '../../../modules/habit/services/listHabits.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';

describe('list habits', () => {
  const habitEntityList = [
    {
      name: 'nome do habito',
      user_id: '1234',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1234',
    },
    {
      name: 'nome do habito',
      user_id: '1234',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1234',
    },
  ];

  const userEntity: ICreateUserDTO = {
    name: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: '12345678',
    birthdate: new Date(),
    username: 'johndoe123',
  };

  let listHabitService: ListHabitsService;
  let habitRepository: Repository<Habit>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListHabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            find: jest.fn().mockReturnValue(habitEntityList),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntity),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    listHabitService = module.get<ListHabitsService>(ListHabitsService);
  });

  it('should be defined service', async () => {
    expect(listHabitService).toBeDefined();
  });

  it('should be able to list habits', async () => {
    const result = await listHabitService.execute('1');
    expect(result.length).toEqual(habitEntityList.length);
    expect(habitRepository.find).toBeCalledTimes(1);
  });

  it('should be able response of error', async () => {
    jest.spyOn(habitRepository, 'find').mockRejectedValue(new Error());

    expect(listHabitService.execute('1')).rejects.toThrowError();

    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.find).toBeCalledTimes(0);
  });
});
