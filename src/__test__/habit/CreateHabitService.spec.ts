import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import Habit from '../../modules/habit/infra/typeorm/entities/Habit';
import CreateHabitService from '../../modules/habit/services/createHabit.service';
import User from '../../modules/user/infra/typeorm/entities/User';
import ICreateUserDTO from '../../modules/user/dtos/ICreateUserDTO';
import ICreateHabitDTO from '../../modules/habit/dtos/ICreateHabitDTO';

const habitEntityList: ICreateHabitDTO = new Habit({
  user_id: '1234',
  description: 'levantar cedo',
  objective: 'acordar cedo',
  color: '#fff',
  buddy_id: '1234',
});

const userEntityList: ICreateUserDTO = new User({
  name: 'namefield2',
  username: 'usernamefield2',
  lastname: 'lastnamefield2',
  email: 'emailfail2@gmail.com',
  password: 'qwe1232',
  birthdate: new Date(),
});

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    habitService = module.get<CreateHabitService>(CreateHabitService);
  });

  it('should be defined', async () => {
    expect(habitService).toBeDefined();
  });

  it('should be able to create a new habit', async () => {
    const data: ICreateHabitDTO = new Habit({
      user_id: '1234',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1234',
    });

    const result = await habitService.execute(data);

    expect(result).toEqual(habitEntityList);
    expect(userRepository.findOne).toBeCalledTimes(2);
    expect(habitRepository.create).toBeCalledTimes(1);
    expect(habitRepository.save).toBeCalledTimes(1);
  });

  it('should not be able a create a habit with user_id nullable', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error()); //remockando uma função pra dar erro uma vez e depois do teste ela vai voltar a ser oque era antes no provider

    const data: ICreateHabitDTO = new Habit({
      user_id: '1234',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1234',
    });

    expect(habitService.execute(data)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.create).toBeCalledTimes(0);
    expect(habitRepository.save).toBeCalledTimes(0);
  });
});
