import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateFinanceDTO from '../../../modules/finances/dtos/ICreateFinanceDTO';
import UpdateFinanceService from '../../../modules/finances/services/updateFinance.service';
import Finance, {
  TypeFinance,
} from '../../../modules/finances/infra/typeorm/entities/Finance';

describe('update user', () => {
  const financeEntity: ICreateFinanceDTO = {
    description: 'descrição da finança',
    value: 1000,
    date: new Date(),
    status: true,
    type: TypeFinance.INPUT,
    user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
  };

  const financeEntityUpdated: ICreateFinanceDTO = {
    description: 'descrição da finança 2',
    value: 1100,
    date: new Date(),
    status: false,
    type: TypeFinance.OUTPUT,
    user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
  };

  let updateFinanceService: UpdateFinanceService;
  let financeRepository: Repository<Finance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFinanceService,
        {
          provide: getRepositoryToken(Finance),
          useValue: {
            findOne: jest.fn().mockReturnValue(financeEntity),
            merge: jest.fn().mockReturnValue(financeEntityUpdated),
            save: jest.fn().mockReturnValue(financeEntityUpdated),
          },
        },
      ],
    }).compile();

    financeRepository = module.get<Repository<Finance>>(
      getRepositoryToken(Finance),
    );

    updateFinanceService = module.get<UpdateFinanceService>(
      UpdateFinanceService,
    );
  });

  it('should be defined', async () => {
    expect(UpdateFinanceService).toBeDefined();
  });

  it('should be able update a finance', async () => {
    const tags = {
      date: new Date(),
      description: 'nova descrição',
      status: true,
      value: 1000,
    };

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '85ee3900-f88a-4759-b80b-c58ce4062a54';

    const response = await updateFinanceService.execute(user_id, id, {
      date: tags.date,
      description: tags.description,
      status: tags.status,
      value: tags.value,
    });

    expect(response).toEqual(financeEntity);
    expect(financeRepository.findOne).toBeCalledTimes(2);
    expect(financeRepository.merge).toBeCalledTimes(1);
    expect(financeRepository.save).toBeCalledTimes(1);
  });

  it('Should not be able update user, because user not exists', async () => {
    jest.spyOn(financeRepository, 'findOne').mockRejectedValueOnce(new Error());

    const tags = {
      date: new Date(),
      description: 'nova descrição',
      status: true,
      value: 1000,
    };

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '85ee3900-f88a-4759-b80b-c58ce4062a54';

    expect(
      updateFinanceService.execute(id, user_id, {
        date: tags.date,
        description: tags.description,
        status: tags.status,
        value: tags.value,
      }),
    ).rejects.toThrowError();
    expect(financeRepository.findOne).toBeCalledTimes(1);
    expect(financeRepository.merge).toBeCalledTimes(0);
    expect(financeRepository.save).toBeCalledTimes(0);
  });
});
