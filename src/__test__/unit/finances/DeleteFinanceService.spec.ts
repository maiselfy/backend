import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateFinanceDTO from '../../../modules/finances/dtos/ICreateFinanceDTO';
import Finance, {
  TypeFinance,
} from '../../../modules/finances/infra/typeorm/entities/Finance';
import DeleteFinanceService from '../../../modules/finances/services/deleteFinance.service';

describe('delete finance', () => {
  const financeEntity: ICreateFinanceDTO = {
    description: 'descrição da finança',
    value: 1000,
    date: new Date(),
    status: true,
    type: TypeFinance.INPUT,
    user_id: 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e',
  };

  const financeSuccessflyDelete = {
    raw: 0,
    affected: 1,
  };

  let deleteFinanceService: DeleteFinanceService;
  let financeRepository: Repository<Finance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFinanceService,
        {
          provide: getRepositoryToken(Finance),
          useValue: {
            findOne: jest.fn().mockReturnValue(financeEntity),
            delete: jest.fn().mockReturnValue(financeSuccessflyDelete),
          },
        },
      ],
    }).compile();

    financeRepository = module.get<Repository<Finance>>(
      getRepositoryToken(Finance),
    );

    deleteFinanceService = module.get<DeleteFinanceService>(
      DeleteFinanceService,
    );
  });

  it('should be defined', async () => {
    expect(DeleteFinanceService).toBeDefined();
  });

  it('should be able to delete a note', async () => {
    const financeSuccessflyDelete = {
      raw: 0,
      affected: 1,
    };

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '3e7e5a73-cfad-4900-87d6-a94afeb78855';

    const response = await deleteFinanceService.execute(id, user_id);

    expect(response).toEqual(financeSuccessflyDelete);
    expect(financeRepository.findOne).toBeCalledTimes(2);
    expect(financeRepository.delete).toBeCalledTimes(1);
  });

  it('should not be able get a note with habit_id nullable', async () => {
    jest.spyOn(financeRepository, 'findOne').mockRejectedValueOnce(new Error());

    const user_id = 'b6ce2dba-0577-4fe5-97bf-5fa55ee7d63e';
    const id = '3e7e5a73-cfad-4900-87d6-a94afeb78855';

    expect(deleteFinanceService.execute(id, user_id)).rejects.toThrowError();
    expect(financeRepository.findOne).toBeCalledTimes(1);
    expect(financeRepository.delete).toBeCalledTimes(0);
  });
});
