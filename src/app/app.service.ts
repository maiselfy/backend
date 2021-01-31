import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

@Injectable()
export class AppService {
  public async bootServer(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
}
