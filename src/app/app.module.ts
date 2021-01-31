import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'user/infra/http/user.controller';
import { AppService } from './app.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule],
  controllers: [UserController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
