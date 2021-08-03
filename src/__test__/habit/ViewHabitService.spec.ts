import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import IViewHabitDTO from '../../modules/habit/dtos/IViewHabitDTO';
import { Repository } from 'typeorm';
import Habit from '../../modules/habit/infra/typeorm/entities/Habit';
import ViewHabitService from '../../modules/habit/services/viewHabit.service';

const habitentity: IViewHabitDTO = new Habit({
  name: 'nome',
  description: 'levantar tarde',
  objective: 'acordar cedo',
  color: '#fff',
  buddy_id: '1235',
  frequency: [],
});

describe('view habits service', () => {
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
    expect(habitRepository.findOne).toBeCalledTimes(1);
  });

  it('should not be able to view with id habit nullable', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(viewHabitservice.execute('12345', '1')).rejects.toThrowError();
    expect(habitRepository.findOne).toBeCalledTimes(1);
  });
});
