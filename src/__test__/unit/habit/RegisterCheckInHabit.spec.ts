import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import User from '../../../modules/user/infra/typeorm/entities/User';
import HabitDayCheck from '../../../modules/habit/infra/typeorm/entities/HabitDayCheck';
import RegisterCheckInHabitService from '../../../modules/habit/services/registerCheckInHabit.service';
import IRegisterCheckInHabitDTO from '../../../modules/habit/dtos/IRegisterCheckInHabitDTO';

describe('create habit', () => {
  const habitEntity: Habit = {
    name: 'nome do habito',
    user_id: 'idfield',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
    buddy: undefined,
    created_at: new Date(),
    updated_at: new Date(),
    frequency: [],
    id: '12445',
  };

  const habitDayCheck: HabitDayCheck = {
    user_id: 'idfield',
    created_at: new Date(),
    updated_at: new Date(),
    date: new Date(),
    habit_id: '12445',
    id: '12345',
  };

  const userEntity: User = {
    name: 'namefield',
    username: 'usernamefield',
    lastname: 'lastnamefield',
    email: 'emailfield@gmail.com',
    password: 'qwe123',
    birthdate: new Date(),
    id: 'idfield',
    bodies: [],
    avatar: 'avatarfield',
    created_at: new Date(),
    updated_at: new Date(),
    fullName: 'fullnamefield',
  };

  const habitDayCheckEntity: IRegisterCheckInHabitDTO = {
    user_id: '12345',
    habit_id: '12345',
    date: new Date().getDate(),
  };

  let habitService: RegisterCheckInHabitService;
  let userRepository: Repository<User>;
  let habitRepository: Repository<Habit>;
  let habitDayCheckRepository: Repository<HabitDayCheck>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterCheckInHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntity),
          },
        },
        {
          provide: getRepositoryToken(HabitDayCheck),
          useValue: {
            create: jest.fn().mockReturnValue(habitDayCheck),
            save: jest.fn().mockReturnValue(habitDayCheck),
          },
        },
      ],
    }).compile();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    habitDayCheckRepository = module.get<Repository<HabitDayCheck>>(
      getRepositoryToken(HabitDayCheck),
    );
    habitService = module.get<RegisterCheckInHabitService>(
      RegisterCheckInHabitService,
    );
  });

  it('should be defined', async () => {
    expect(habitService).toBeDefined();
  });

  it('should not be able to register check in habit', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: IRegisterCheckInHabitDTO = {
      user_id: '12345',
      habit_id: '12345',
      date: new Date().getDate(),
    };

    expect(habitService.execute(data)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitDayCheckRepository.create).toBeCalledTimes(0);
    expect(habitDayCheckRepository.save).toBeCalledTimes(0);
  });
});
