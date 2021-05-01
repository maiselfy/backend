import { NestFactory } from '@nestjs/core';
import { static as expressStatic } from 'express';
import { AppModule } from './app/app.module';
import uploadConfig from './config/upload.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use('/files', expressStatic(uploadConfig.directory));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
