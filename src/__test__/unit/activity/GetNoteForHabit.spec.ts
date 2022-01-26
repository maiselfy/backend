import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import GetNoteForHabitService from '../../../modules/activity/services/getNoteForHabit.service';
import ICreateHabitDTO from '../../../modules/habit/dtos/ICreateHabitDTO';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import User from '../../../modules/user/infra/typeorm/entities/User';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import Note from '../../../modules/activity/infra/typeorm/entities/Note';

describe('get note for a habit', () => {
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

  const noteEntity = {
    habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
    user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
  };

  let getNoteForHabitService: GetNoteForHabitService;
  let userRepository: Repository<User>;
  let habitRepository: Repository<Habit>;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNoteForHabitService,
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
          },
        },
        {
          provide: getRepositoryToken(Note),
          useValue: {
            find: jest.fn().mockReturnValue(noteEntity),
          },
        },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));

    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));

    getNoteForHabitService = module.get<GetNoteForHabitService>(
      GetNoteForHabitService,
    );
  });

  it('should be defined', async () => {
    expect(GetNoteForHabitService).toBeDefined();
  });

  it('should be able to get note for habit', async () => {
    const habit_id = '04ff4716-a9a0-4f5f-8cd0-67108ffc5141';
    const user_id = '2596f6de-2475-4947-85a8-b3a154504b2a';

    const response = await getNoteForHabitService.execute(habit_id, user_id);

    expect(response).toEqual(noteEntity);
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(2);
    expect(noteRepository.find).toBeCalledTimes(1);
  });

  it('should not be able to get note for habit with user_id nullable', async () => {
    const habit_id = '04ff4716-a9a0-4f5f-8cd0-67108ffc5141';
    const user_id = '2596f6de-2475-4947-85a8-b3a154504b2a';

    const response = await getNoteForHabitService.execute(habit_id, user_id);

    expect(response).toEqual(noteEntity);
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(2);
    expect(noteRepository.find).toBeCalledTimes(1);
  });

  it('should not be able get a note with user_id nullable', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    const habit_id = '04ff4716-a9a0-4f5f-8cd0-67108ffc5141';
    const user_id = '2596f6de-2475-4947-85a8-b3a154504b2a';

    expect(
      getNoteForHabitService.execute(habit_id, user_id),
    ).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(0);
    expect(noteRepository.find).toBeCalledTimes(0);
  });

  it('should not be able get a note with habit_id nullable', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    const habit_id = '04ff4716-a9a0-4f5f-8cd0-67108ffc5141';
    const user_id = '2596f6de-2475-4947-85a8-b3a154504b2a';

    expect(
      getNoteForHabitService.execute(habit_id, user_id),
    ).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(0);
    expect(noteRepository.find).toBeCalledTimes(0);
  });
});
