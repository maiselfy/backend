import { NestFactory } from '@nestjs/core';
import { static as expressStatic } from 'express';
import { AppModule } from './app/app.module';
import uploadConfig from './config/upload.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use('/files', expressStatic(uploadConfig.directory));
  app.enableCors({
    origin: ['http://localhost:3000', 'https://app.maiself.com.br'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  await app.listen(3333);
}
bootstrap();
