import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpController } from './infra/http/user.controller';
import { BCryptHashProvider } from './providers/HashProvider/implementations/BCryptHashProvider';
import User from './infra/typeorm/entities/User';
import Body from './infra/typeorm/entities/Body';
import CreateUserService from './services/createUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Body])],
  controllers: [HttpController],
  providers: [CreateUserService, BCryptHashProvider],
})
export class UserModule {}
