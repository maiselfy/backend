import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ListFinanceForUserService from '../../../modules/finances/services/listFinancesForUser.service';
import ICreateFinanceDTO from '../../../modules/finances/dtos/ICreateFinanceDTO';
import Finance, {
  TypeFinance,
} from '../../../modules/finances/infra/typeorm/entities/Finance';
import ICreateUserDTO from '../../../modules/user/dtos/ICreateUserDTO';
import User from '../../../modules/user/infra/typeorm/entities/User';

describe('list finances for user', () => {
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

  let listFinancesForUserService: ListFinanceForUserService;
  let userRepository: Repository<User>;
  let financeRepository: Repository<Finance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFinanceForUserService,
        {
          provide: getRepositoryToken(Finance),
          useValue: {
            find: jest.fn().mockReturnValue(financeEntity),
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

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    financeRepository = module.get<Repository<Finance>>(
      getRepositoryToken(Finance),
    );

    listFinancesForUserService = module.get<ListFinanceForUserService>(
      ListFinanceForUserService,
    );
  });

  it('should be defined', async () => {
    expect(ListFinanceForUserService).toBeDefined();
  });

  it('should be able to list finances for user', async () => {
    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';

    const response = await listFinancesForUserService.execute(user_id);

    expect(response).toEqual(financeEntity);
    expect(financeRepository.find).toBeCalledTimes(1);
    expect(userRepository.findOne).toBeCalledTimes(1);
  });

  it('should not be able to list finances for user with user_id nullable', async () => {
    jest.spyOn(financeRepository, 'find').mockRejectedValueOnce(new Error());

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';

    expect(listFinancesForUserService.execute(user_id)).rejects.toThrowError();
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(financeRepository.find).toBeCalledTimes(0);
  });
});
