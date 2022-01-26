import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ICreateTagDTO from '../../../modules/finances/dtos/ICreateTagDTO';
import CreateTagService from '../../../modules/finances/services/createTag.service';
import Tag from '../../../modules/finances/infra/typeorm/entities/Tag';

describe('create a tag', () => {
  const tagEntity: ICreateTagDTO = {
    color: 'blue gremio',
    finance_id: '1234',
    name: 'tag de entradas',
  };

  let createTagService: CreateTagService;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            create: jest.fn().mockReturnValue(tagEntity),
            save: jest.fn().mockReturnValue(tagEntity),
          },
        },
      ],
    }).compile();

    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));

    createTagService = module.get<CreateTagService>(CreateTagService);
  });

  it('should be defined', async () => {
    expect(CreateTagService).toBeDefined();
  });

  it('should be able a create new tag', async () => {
    const data: ICreateTagDTO = {
      color: 'blue gremio',
      finance_id: '1234',
      name: 'tag de entradas',
    };

    const response = await createTagService.execute(data);

    expect(response).toEqual(data);
    expect(tagRepository.create).toBeCalledTimes(1);
    expect(tagRepository.save).toBeCalledTimes(1);
  });
});
