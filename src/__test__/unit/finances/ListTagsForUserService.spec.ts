import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ICreateTagDTO from '../../../modules/finances/dtos/ICreateTagDTO';
import Tag from '../../../modules/finances/infra/typeorm/entities/Tag';
import ListTagsForUserService from '../../../modules/finances/services/listTagsForUser.service';

describe('list tags for user', () => {
  const data: Array<ICreateTagDTO> = [
    {
      color: 'blue gremio',
      finance_id: '1234',
      name: 'tag de entradas',
    },
    {
      color: 'red flamengo',
      finance_id: '1233',
      name: 'tag de saídas',
    },
    {
      color: 'yellow pelotas',
      finance_id: '1244',
      name: 'tag de estagnação',
    },
  ];

  let listTagsForUserService: ListTagsForUserService;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTagsForUserService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            find: jest.fn().mockReturnValue(data),
          },
        },
      ],
    }).compile();

    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));

    listTagsForUserService = module.get<ListTagsForUserService>(
      ListTagsForUserService,
    );
  });

  it('should be defined', async () => {
    expect(ListTagsForUserService).toBeDefined();
  });

  it('should be able get and lists tags of user', async () => {
    const finance_id = '1234';

    const response = await listTagsForUserService.execute(finance_id);

    expect(response).toEqual(data);
    expect(tagRepository.find).toBeCalledTimes(1);
  });

  it('should not be able get and lists tags of user with finance_id null', async () => {
    jest.spyOn(tagRepository, 'find').mockRejectedValueOnce(new Error());

    const finance_id = '1234';

    expect(listTagsForUserService.execute(finance_id)).rejects.toThrowError();
    expect(tagRepository.find).toBeCalledTimes(1);
  });
});
