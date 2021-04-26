import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/infra/typeorm/entities/User';
import Body from 'src/user/infra/typeorm/entities/Body';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../config/mailer/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [User, Body],
    }),
    MailerModule.forRoot(mailerConfig),
    TypeOrmModule.forFeature([User, Body]),
    UserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
