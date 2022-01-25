import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/modules/user/infra/typeorm/entities/User';
import { intervalToDuration } from 'date-fns';
import Finance from '../infra/typeorm/entities/Finance';

@Injectable()
export default class FinancialBalanceForUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Finance) private financesRepository: Repository<Finance>,
  ) {}

  financialInputsSum: number;
  financialOutputsSum: number;
  financialBalance: number;

  async execute({ userId, financeId }): Promise<any> {
    this.financialInputsSum = 0.0;
    this.financialOutputsSum = 0.0;
    this.financialBalance = 0.0;

    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );
      }

      const financialInputs = await this.financesRepository.find({
        where: { userId, type: 'INPUT' },
      });

      const financialOutputs = await this.financesRepository.find({
        where: { userId, type: 'OUTPUT' },
      });

      const haveFinances = allFinances.length;

      if (haveFinances === 0 || null) {
        throw new HttpException(
          {
            message: 'Sorry, this user has no registered finances',
            code: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      financialInputs.forEach(input => {
        financialInputsSum += input.value;
      });

      financialOutputs.forEach(output => {
        financialOutputsSum += output.value;
      });

      financialBalance = financialInputsSum - financialOutputsSum;

      return financialBalance;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
