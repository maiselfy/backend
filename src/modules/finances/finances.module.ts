import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanceController } from './infra/http/finance.controller';

import CreateTagService from './services/createTag.service';
import CreateFinanceService from './services/createFinance.service';
import UpdateFinanceService from './services/updateFinance.service';
import ViewFinanceService from './services/viewFinance.service';
import ListFinancesForUserService from './services/listFinancesForUser.service';
import FinancialBalanceForUserService from './services/financialBalanceForUser.service';
import DeleteFinanceService from './services/deleteFinance.service';
import ListTagsForUserService from './services/listTagsForUser.service';

import Tag from './infra/typeorm/entities/Tag';
import Finance from './infra/typeorm/entities/Finance';
import User from '../user/infra/typeorm/entities/User';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Tag, Finance, User]),
  ],
  controllers: [FinanceController],
  providers: [
    CreateTagService,
    CreateFinanceService,
    UpdateFinanceService,
    DeleteFinanceService,
    ViewFinanceService,
    ListFinancesForUserService,
    FinancialBalanceForUserService,
    ListTagsForUserService,
  ],
})
export class FinancesModule {}
