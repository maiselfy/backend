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

  async execute(user_id: string): Promise<number> {
    this.financialInputsSum = 0.0;
    this.financialOutputsSum = 0.0;
    this.financialBalance = 0.0;

    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user) {
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );
      }

      const financialInputs = await this.financesRepository.find({
        where: { user_id, type: 'INPUT' },
      });

      const financialOutputs = await this.financesRepository.find({
        where: { user_id, type: 'OUTPUT' },
      });

      if (
        financialInputs.length === 0 ||
        null ||
        financialOutputs.length === 0
      ) {
        throw new HttpException(
          {
            message: 'Sorry, this user has no registered finances',
            code: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      financialInputs.forEach(input => {
        this.financialInputsSum += input.value;
      });

      financialOutputs.forEach(output => {
        this.financialOutputsSum += output.value;
      });

      this.financialBalance =
        this.financialInputsSum - this.financialOutputsSum;

      return this.financialBalance;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
