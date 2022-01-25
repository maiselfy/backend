import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import ICreateHabitDTO from '../../../modules/habit/dtos/ICreateHabitDTO';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import CreateNoteForHabitService from '../../../modules/activity/services/createNoteForHabit.service';
import User from '../../../modules/user/infra/typeorm/entities/User';
import Habit from '../../../modules/habit/infra/typeorm/entities/Habit';
import ICreateNoteDTO from '../../../modules/activity/dtos/ICreateNoteDTO';
import Note from '../../../modules/activity/infra/typeorm/entities/Note';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('create note for habit', () => {
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

  const noteEntity: ICreateNoteDTO = {
    habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
    user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
    note: 'note for habit',
  };

  let noteHabitService: CreateNoteForHabitService;
  let habitRepository: Repository<Habit>;
  let userRepository: Repository<User>;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNoteForHabitService,
        {
          provide: getRepositoryToken(Note),
          useValue: {
            create: jest.fn().mockReturnValue(noteEntity),
            save: jest.fn().mockResolvedValue(noteEntity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntity),
          },
        },
        {
          provide: getRepositoryToken(Habit),
          useValue: {
            findOne: jest.fn().mockReturnValue(habitEntity),
          },
        },
      ],
    }).compile();

    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));

    noteHabitService = module.get<CreateNoteForHabitService>(
      CreateNoteForHabitService,
    );
  });

  it('should be defined', async () => {
    expect(CreateNoteForHabitService).toBeDefined();
  });

  it('should be able to cerate a new habit', async () => {
    const data: ICreateNoteDTO = {
      habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
      user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
      note: 'note for habit',
    };

    const response = await noteHabitService.execute(data);

    expect(response).toEqual(noteEntity);
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(1);
    expect(noteRepository.create).toBeCalledTimes(1);
    expect(noteRepository.create).toBeCalledTimes(1);
  });

  it('should not be able a create a note with user_id nullable', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateNoteDTO = {
      habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
      user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
      note: 'note for habit',
    };

    expect(noteHabitService.execute(data)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(0);
    expect(noteRepository.create).toBeCalledTimes(0);
    expect(noteRepository.create).toBeCalledTimes(0);
  });

  it('should not be able a create a note with habit_id nullable', async () => {
    jest.spyOn(habitRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateNoteDTO = {
      habit_id: '04ff4716-a9a0-4f5f-8cd0-67108ffc5141',
      user_id: '2596f6de-2475-4947-85a8-b3a154504b2a',
      note: 'note for habit',
    };

    expect(noteHabitService.execute(data)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(habitRepository.findOne).toBeCalledTimes(0);
    expect(noteRepository.create).toBeCalledTimes(0);
    expect(noteRepository.create).toBeCalledTimes(0);
  });
});
