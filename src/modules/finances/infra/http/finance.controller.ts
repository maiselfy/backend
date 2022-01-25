import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import CreateFinanceService from '../../services/createFinance.service';
import UpdateFinanceService from '../../services/updateFinance.service';
import DeleteFinanceService from '../../services/deleteFinance.service';
import ListFinancesForUserService from '../../services/listFinancesForUser.service';
import ViewFinanceService from '../../services/viewFinance.service';
import IUpdateFinanceDTO from '../../dtos/IUpdateFinanceDTO';
import ICreateFinanceDTO from '../../dtos/ICreateFinanceDTO';
import Finance from '../typeorm/entities/Finance';
import FinancialBalanceForUserService from '../../services/financialBalanceForUser.service';

@Controller('finance')
export class FinanceController {
  constructor(
    private createFinanceService: CreateFinanceService,
    private updateFinanceService: UpdateFinanceService,
    private deleteFinanceService: DeleteFinanceService,
    private listFinancesForUserService: ListFinancesForUserService,
    private viewFinanceService: ViewFinanceService,
    private financialBalanceForUserService: FinancialBalanceForUserService,
  ) {}

  @Post()
  createFinance(
    @Body()
    { description, value, date, status, type, user_id }: ICreateFinanceDTO,
  ): Promise<Finance> {
    return this.createFinanceService.execute({
      description,
      value,
      date,
      status,
      type,
      user_id,
    });
  }

  @Put(':user_id/:id')
  updateFinance(
    @Param('user_id') user_id: string,
    @Param('id') id: string,
    @Body()
    { description, value, date, status }: IUpdateFinanceDTO,
  ): Promise<Finance> {
    return this.updateFinanceService.execute(user_id, id, {
      description,
      value,
      date,
      status,
    });
  }

  @Delete('delete/:user_id/:id')
  async deleteFinance(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const successfulDelete = await this.deleteFinanceService.execute(
      user_id,
      id,
    );
    if (successfulDelete.valueOf()) {
      return res.status(204).send({ message: 'Finance has been deleted.' });
    }
  }

  @Get('list/:user_id')
  async listFinancesForUser(
    @Param('user_id') user_id: string,
  ): Promise<Finance[]> {
    const finances = await this.listFinancesForUserService.execute(user_id);

    return finances;
  }

  @Get('view/:user_id/:id')
  viewFinanceOfUser(
    @Param('user_id') user_id: string,
    @Param('id') id: string,
  ): Promise<Finance> {
    return this.viewFinanceService.execute(user_id, id);
  }

  @Get('balance/:user_id/')
  calculateFinancialBalanceOfUser(
    @Param('user_id') user_id: string,
  ): Promise<number> {
    return this.financialBalanceForUserService.execute(user_id);
  }
}
