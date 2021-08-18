import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import IUpdateHabitDTO from '../../../modules/habit/dtos/IUpdateHabitDTO';
import UpdateHabitService from '../../../modules/habit/services/updateHabit.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('update habit', () => {
  const habitEntity: IUpdateHabitDTO = {
    name: 'levantar cedo',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
  };

  const userEntity: ICreateUserDTO = {
    username: 'noobmaster69',
    name: 'john',
    lastname: 'doe',
    email: 'teste@gmail.com',
    password: '12345',
    birthdate: new Date(),
  };

  let updateHabitService: UpdateHabitService;
  let habitRepository: Repository<Habit>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
            merge: jest.fn(),
            save: jest.fn().mockResolvedValue(habitEntity),
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

    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    updateHabitService = module.get<UpdateHabitService>(UpdateHabitService);
  });

  it('should be defined service', async () => {
    expect(updateHabitService).toBeDefined();
  });

  it('should be able to update a habit valid', async () => {
    const data: IUpdateHabitDTO = {
      name: 'nome do habito',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1235',
    };

    const result = await updateHabitService.execute('1', '1235', data);
    expect(result).toEqual(habitEntity);
    expect(usersRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(2);
    expect(habitRepository.merge).toBeCalledTimes(1);
    expect(habitRepository.save).toBeCalledTimes(1);
  });

  it('should not be able do update a habit with no user id', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: IUpdateHabitDTO = {
      name: 'nome do habito',
      description: 'levantar cedo',
      objective: 'acordar cedo',
      color: '#fff',
      buddy_id: '1235',
    };

    expect(
      updateHabitService.execute('1', '12345', data),
    ).rejects.toThrowError();
    expect(habitRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.merge).toBeCalledTimes(0);
    expect(habitRepository.save).toBeCalledTimes(0);
  });
});
