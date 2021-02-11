import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpController } from './infra/http/user.controller';
import { SessionController } from './infra/http/session.controller'
import { BCryptHashProvider } from './providers/HashProvider/implementations/BCryptHashProvider';
import User from './infra/typeorm/entities/User';
import Body from './infra/typeorm/entities/Body';
import CreateUserService from './services/createUser.service';
import AuthenticateUserService from './services/authenticateUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Body])],
  controllers: [HttpController, SessionController],
  providers: [
    CreateUserService,
    AuthenticateUserService,
    BCryptHashProvider
  ],
})
export class UserModule {}
