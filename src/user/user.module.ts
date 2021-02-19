import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './infra/http/user.controller';
import { SessionController } from './infra/http/session.controller';
import { BCryptHashProvider } from './providers/HashProvider/implementations/BCryptHashProvider';
import User from './infra/typeorm/entities/User';
import Body from './infra/typeorm/entities/Body';
import CreateUserService from './services/createUser.service';
import AuthenticateUserService from './services/authenticateUser.service';
import { JwtModule } from '@nestjs/jwt';
import { secret, expiresIn } from '../config/jwt/config.jwt';
import { EnsureAuthenticatedMiddleware } from 'src/shared/http/middlewares/ensure-authenticated.middleware';
import UpdateUserAvatarService from './services/updateUserAvatar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Body]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  controllers: [UserController, SessionController],
  providers: [
    CreateUserService,
    AuthenticateUserService,
    BCryptHashProvider,
    UpdateUserAvatarService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .forRoutes({ path: 'user/avatar', method: RequestMethod.PATCH });
  }
}
