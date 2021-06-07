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
      apiKey: process.env.SENDGRID_API_KEY,
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
      .forRoutes({ path: 'user/avatar', method: RequestMethod.PATCH });
  }
}