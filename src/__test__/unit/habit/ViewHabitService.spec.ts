import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import ViewHabitService from '../../../modules/habit/services/viewHabit.service';

describe('view habits service', () => {
  const habitentity = {
    name: 'nome do hábito',
    description: 'hábito de levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '12345',
    frequency: [],
  };

  let viewHabitservice: ViewHabitService;
  let habitRepository: Repository<Habit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitentity),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    viewHabitservice = module.get<ViewHabitService>(ViewHabitService);
  });

  it('should be able to view habits', async () => {
    const result = await viewHabitservice.execute('12345', '1');
    expect(result).toEqual(habitentity);
    expect(habitRepository.findOne).toBeCalledTimes(2);
  });

  it('should not be able to view with id habit nullable', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(viewHabitservice.execute('12345', '1')).rejects.toThrowError();
    expect(habitRepository.findOne).toBeCalledTimes(1);
  });
});
