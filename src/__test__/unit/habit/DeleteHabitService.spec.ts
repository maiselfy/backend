import DeleteHabitService from '../../../modules/habit/services/deleteHabit.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import ICreateHabitDTO from '../../../modules/habit/dtos/ICreateHabitDTO';

describe('delete habit', () => {
  const habityEntity: ICreateHabitDTO = {
    name: 'nome do habito',
    user_id: '1234',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '1234',
  };

  const habitSuccessuflyDelete = {
    raw: 0,
    affected: 1,
  };

  let habitRepository: Repository<Habit>;
  let deleteHabitService: DeleteHabitService;

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

  it('should be able service defined', () => {
    expect(deleteHabitService).toBeDefined();
  });

  it('should be able a delete a service', async () => {
    const result = await deleteHabitService.execute('1', '1');

    expect(result).toMatchObject({ affected: 1, raw: 0 });
    expect(habitRepository.findOne).toBeCalledTimes(2);
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

    expect(result).toMatchObject({ affected: 0, raw: 1 });
    expect(habitRepository.findOne).toHaveBeenCalledTimes(2);
    expect(habitRepository.delete).toHaveBeenCalledTimes(1);

    habitSuccessuflyDelete.raw = 0;
    habitSuccessuflyDelete.affected = 1;
  });
});
