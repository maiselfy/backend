import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateFinanceDTO from '../../../modules/finances/dtos/ICreateFinanceDTO';
import Finance, {
  TypeFinance,
} from '../../../modules/finances/infra/typeorm/entities/Finance';
import ViewFinanceService from '../../../modules/finances/services/viewFinance.service';

describe('view finance', () => {
  const date = new Date();

  const financeEntity: ICreateFinanceDTO = {
    description: 'descrição da finança',
    value: 1000,
    date,
    status: true,
    type: TypeFinance.INPUT,
    user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
  };

  let viewFinanceService: ViewFinanceService;
  let financeRepository: Repository<Finance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewFinanceService,
        {
          provide: getRepositoryToken(Finance),
          useValue: {
            findOne: jest.fn().mockReturnValue(financeEntity),
          },
        },
      ],
    }).compile();

    financeRepository = module.get<Repository<Finance>>(
      getRepositoryToken(Finance),
    );

    viewFinanceService = module.get<ViewFinanceService>(ViewFinanceService);
  });

  it('should be defined', async () => {
    expect(ViewFinanceService).toBeDefined();
  });

  it('should be able view a finance', async () => {
    const financeEntity = {
      description: 'descrição da finança',
      value: 1000,
      date,
      status: true,
      type: TypeFinance.INPUT,
      user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
    };

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '3e7e5a73-cfad-4900-87d6-a94afeb78855';

    const response = await viewFinanceService.execute(id, user_id);

    console.log('response', response);

    expect(response).toEqual(financeEntity);
    expect(financeRepository.findOne).toBeCalledTimes(2);
  });

  it('should not be able view a finance with id nullable', async () => {
    jest.spyOn(financeRepository, 'findOne').mockRejectedValueOnce(new Error());

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '3e7e5a73-cfad-4900-87d6-a94afeb78855';

    expect(viewFinanceService.execute(id, user_id)).rejects.toThrowError();
    expect(financeRepository.findOne).toBeCalledTimes(1);
  });
});
