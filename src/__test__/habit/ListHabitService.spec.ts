import { Test, TestingModule } from '@nestjs/testing';
import ListHabitsService from '../../modules/habit/services/listHabits.service';
import User from '../../modules/user/infra/typeorm/entities/User';
import Habit from '../../modules/habit/infra/typeorm/entities/Habit';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const habitEntity = [
  new Habit({
    user_id: '1234',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
  }),
  new Habit({
    user_id: '1234',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
  }),
];

describe('list habits', () => {
  let listHabitService: ListHabitsService;
  let habitRepository: Repository<Habit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListHabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            find: jest.fn().mockReturnValue(habitEntity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    listHabitService = module.get<ListHabitsService>(ListHabitsService);
  });

  it('should be defined service', async () => {
    expect(listHabitService).toBeDefined();
  });

  it('should be able to list habits', async () => {
    const result = await listHabitService.execute('1');
    expect(result.length).toEqual(habitEntity.length);
    expect(habitRepository.find).toBeCalledTimes(1);
  });
});
