import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from '../modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/modules/user/infra/typeorm/entities/User';
import Body from 'src/modules/user/infra/typeorm/entities/Body';
import UserToken from 'src/modules/user/infra/typeorm/entities/UserToken';
import HabitDayCheck from 'src/modules/habit/infra/typeorm/entities/HabitDayCheck';
import { HabitModule } from 'src/modules/habit/habit.module';
import { ActivityModule } from 'src/modules/activity/activity.module';

import Habit from 'src/modules/habit/infra/typeorm/entities/Habit';
import Note from 'src/modules/activity/infra/typeorm/entities/Note';
import Friendship from 'src/modules/friendship/infra/typeorm/entities/Friendship';
import { FriendshipModule } from 'src/modules/friendship/friendship.module';

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
      entities: [User, Habit, Body, UserToken, HabitDayCheck, Note, Friendship],
    }),
    //TypeOrmModule.forFeature([User, Body, UserToken, HabitDayCheck]),
    UserModule,
    HabitModule,
    ActivityModule,
    FriendshipModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
