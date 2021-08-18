import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import HabitModule from '../../modules/habit/infra/typeorm/entities/Habit';

describe('habit controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HabitModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/habit (GET)', () => {
    return request(app.getHttpServer())
      .post('http://localhost/habit')
      .expect(201);
  });
});
