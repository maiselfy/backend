import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './infra/http/user.controller';
import User from './typeorm/entities/User.entity';
import Body from './typeorm/entities/Body.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Body])],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
