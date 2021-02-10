import { Test, TestingModule } from '@nestjs/testing';
import {  } from './';

describe('', () => {
  let provider: ;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    provider = module.get<>();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
