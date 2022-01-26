import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateHabitDTO from '../../../modules/habit/dtos/ICreateHabitDTO';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import DeleteNoteForHabitService from '../../../modules/activity/services/deleteNoteForHabit.service';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import Note from '../../../modules/activity/infra/typeorm/entities/Note';

describe('delete habit', () => {
  const habitEntity: ICreateHabitDTO = {
    name: 'nome do habito',
    user_id: '1234',
    description: 'levantar cedo',
    objective: 'acordar cedo',
    color: '#fff',
    buddy_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
  };

  const userEntity: ICreateUserDTO = {
    username: 'noobmaster69',
    name: 'john',
    lastname: 'doe',
    email: 'teste@gmail.com',
    password: '12345',
    birthdate: new Date(),
  };

  const noteSuccessuflyDelete = {
    raw: 0,
    affected: 1,
  };

  let deleteNoteForHabitService: DeleteNoteForHabitService;
  let habitRepository: Repository<Habit>;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteNoteForHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
          },
        },
        {
          provide: getRepositoryToken(Note),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntity),
            delete: jest.fn().mockReturnValue(noteSuccessuflyDelete),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));

    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));

    deleteNoteForHabitService = module.get<DeleteNoteForHabitService>(
      DeleteNoteForHabitService,
    );
  });

  it('should be defined', async () => {
    expect(DeleteNoteForHabitService).toBeDefined();
  });

  it('should be able to delete a note', async () => {
    const deletNoteData = {
      id: '32b8c062-bed8-4a04-8346-3d5e7445e60d',
      habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
      user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
    };

    const response = await deleteNoteForHabitService.execute(deletNoteData);

    expect(response).toEqual(true);
    expect(habitRepository.findOne).toBeCalledTimes(2);
    expect(noteRepository.findOne).toBeCalledTimes(1);
    expect(noteRepository.delete).toBeCalledTimes(1);
  });

  it('should not be able get a note with habit_id nullable', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValueOnce(new Error());

    const deletNoteData = {
      id: '32b8c062-bed8-4a04-8346-3d5e7445e60d',
      habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
      user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
    };

    expect(
      deleteNoteForHabitService.execute(deletNoteData),
    ).rejects.toThrowError();
    expect(habitRepository.findOne).toBeCalledTimes(1);
    expect(noteRepository.findOne).toBeCalledTimes(0);
    expect(noteRepository.delete).toBeCalledTimes(0);
  });
});
