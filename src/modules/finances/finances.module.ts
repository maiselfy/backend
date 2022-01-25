import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tag from './infra/typeorm/entities/Tag';
import CreateTagService from './services/createTag.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Tag])],
  controllers: [],
  providers: [CreateTagService],
})
export class FinancesModule {}
