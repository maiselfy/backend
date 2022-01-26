import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateFinanceDTO from '../../../modules/finances/dtos/ICreateFinanceDTO';
import Finance, {
  TypeFinance,
} from '../../../modules/finances/infra/typeorm/entities/Finance';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import CreateFinanceService from '../../../modules/finances/services/createFinance.service';
import User from '../../../modules/user/infra/typeorm/entities/User';

describe('create finance', () => {
  const financeEntity: ICreateFinanceDTO = {
    description: 'descrição da finança',
    value: 1000,
    date: new Date(),
    status: true,
    type: TypeFinance.INPUT,
    user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
  };

  const userEntity: ICreateUserDTO = {
    username: 'noobmaster69',
    name: 'john',
    lastname: 'doe',
    email: 'teste@gmail.com',
    password: '12345',
    birthdate: new Date(),
  };

  let createFinanceService: CreateFinanceService;
  let userRepository: Repository<User>;
  let financeRepository: Repository<Finance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFinanceService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(userEntity),
          },
        },
        {
          provide: getRepositoryToken(Finance),
          useValue: {
            create: jest.fn().mockReturnValue(financeEntity),
            save: jest.fn().mockResolvedValue(financeEntity),
          },
        },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    financeRepository = module.get<Repository<Finance>>(
      getRepositoryToken(Finance),
    );

    createFinanceService = module.get<CreateFinanceService>(
      CreateFinanceService,
    );
  });

  it('should be defined', async () => {
    expect(CreateFinanceService).toBeDefined();
  });

  it('should be able to cerate a new habit', async () => {
    const data: ICreateFinanceDTO = {
      description: 'descrição da finança',
      value: 1000,
      date: new Date(),
      status: true,
      type: TypeFinance.INPUT,
      user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
    };
    const response = await createFinanceService.execute(data);

    expect(response).toEqual(financeEntity);
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(financeRepository.create).toBeCalledTimes(1);
    expect(financeRepository.save).toBeCalledTimes(1);
  });

  it('should not be able a create a note with user_id nullable', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    const data: ICreateFinanceDTO = {
      description: 'descrição da finança',
      value: 1000,
      date: new Date(),
      status: true,
      type: TypeFinance.INPUT,
      user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
    };

    expect(createFinanceService.execute(data)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(financeRepository.create).toBeCalledTimes(0);
    expect(financeRepository.save).toBeCalledTimes(0);
  });
});
