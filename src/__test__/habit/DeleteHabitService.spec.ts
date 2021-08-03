import DeleteHabitService from '../../modules/habit/services/deleteHabit.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Habit from '../../modules/habit/infra/typeorm/entities/Habit';
import ICreateHabitDTO from '../../modules/habit/dtos/ICreateHabitDTO';

const habityEntity: ICreateHabitDTO = new Habit({
  user_id: '1234',
  description: 'levantar cedo',
  objective: 'acordar cedo',
  color: '#fff',
  buddy_id: '1234',
});

const habitSuccessuflyDelete = {
  raw: 0,
  affected: 1,
};

describe('delete habit', () => {
  let deleteHabitService: DeleteHabitService;
  let habitRepository: Repository<Habit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habityEntity),
            delete: jest.fn().mockReturnValue(habitSuccessuflyDelete),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    deleteHabitService = module.get<DeleteHabitService>(DeleteHabitService);
  });

  it('should be able service defined', async () => {
    expect(deleteHabitService).toBeDefined();
  });

  it('should be able a delete a service', async () => {
    const result = await deleteHabitService.execute('1', '1');

    expect(result).toEqual(true);
    expect(habitRepository.findOne).toBeCalledTimes(1);
  });

  it('should not be able to delete a habit with nullable id', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValue(new Error());

    expect(deleteHabitService.execute('1', '')).rejects.toThrowError();
    expect(habitRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.delete).toBeCalledTimes(0);
  });

  it('should not be able to delete with raw null', async () => {
    habitSuccessuflyDelete.raw = 1;
    habitSuccessuflyDelete.affected = 0;

    jest
      .spyOn(habitRepository, 'delete')
      .mockResolvedValueOnce(habitSuccessuflyDelete);
    const result = await deleteHabitService.execute('1', '1');

    expect(result).toEqual(false);
    expect(habitRepository.findOne).toHaveBeenCalledTimes(1);
    expect(habitRepository.delete).toHaveBeenCalledTimes(1);

    habitSuccessuflyDelete.raw = 0;
    habitSuccessuflyDelete.affected = 1;
  });
});
