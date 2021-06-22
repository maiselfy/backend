import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './infra/typeorm/entities/User';
import Body from './infra/typeorm/entities/Body';
import { secret, expiresIn } from '../../config/jwt/config.jwt';
import { UserController } from './infra/http/user.controller';
import CreateUserService from './services/createUser.service';
import UpdateUserService from './services/updateUser.service';
import { SessionController } from './infra/http/session.controller';
import UpdateUserAvatarService from './services/updateUserAvatar.service';
import AuthenticateUserService from './services/authenticateUser.service';
import { BCryptHashProvider } from './providers/HashProvider/implementations/BCryptHashProvider';
import { EnsureAuthenticatedMiddleware } from 'src/shared/http/middlewares/ensure-authenticated.middleware';
import DeleteUserService from './services/deleteUser.service';
import { RecoverPasswordController } from './infra/http/recoverPassword.controller';
import { SendEmailWithTokenService } from './services/sendEmailWithToken.service';
import UserToken from './infra/typeorm/entities/UserToken';
import { ResetPasswordService } from './services/resetPassword.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Body, UserToken]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: expiresIn },
    }),
    SendGridModule.forRoot({
      apiKey:
        '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',
    }),
  ],
  controllers: [UserController, SessionController, RecoverPasswordController],
  providers: [
    CreateUserService,
    AuthenticateUserService,
    BCryptHashProvider,
    UpdateUserAvatarService,
    UpdateUserService,
    DeleteUserService,
    SendEmailWithTokenService,
    ResetPasswordService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .exclude(
        { method: RequestMethod.POST, path: 'api/session' },
        { method: RequestMethod.POST, path: 'api/user' },
        { method: RequestMethod.POST, path: 'api/forgot-password' },
        { method: RequestMethod.POST, path: 'api/reset-password/:token' },
      )
      .forRoutes('*');
  }
}
