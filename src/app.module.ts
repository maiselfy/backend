import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { HabitModule } from 'src/modules/habit/habit.module';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { FriendshipModule } from 'src/modules/friendship/friendship.module';
import { join } from 'path';

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
      entities: [join(__dirname, process.env.TYPEORM_ENTITIES)],
    }),
    UserModule,
    HabitModule,
    ActivityModule,
    FriendshipModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
