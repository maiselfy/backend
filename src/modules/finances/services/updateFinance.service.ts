import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import IUpdateFinanceDTO from '../dtos/IUpdateFinanceDTO';
import Finance from '../infra/typeorm/entities/Finance';

@Injectable()
export default class UpdateFinanceService {
  constructor(
    @InjectRepository(Finance) private financesRepository: Repository<Finance>,
  ) {}

  async execute(
    user_id: string,
    id: string,
    { description, value, date, status }: IUpdateFinanceDTO,
  ): Promise<Finance> {
    try {
      const finance = await this.financesRepository.findOne({
        where: { id: id },
      });

      if (!finance) {
        throw new HttpException(
          'This finance does not exist in the our database.',
          HttpStatus.NOT_FOUND,
        );
      }

      const isTheUserFinance = await this.financesRepository.findOne({
        where: { user_id },
      });

      if (!isTheUserFinance) {
        throw new HttpException(
          'There is no corresponding finance for this user',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedFinance = this.financesRepository.merge(finance, {
        description,
        value,
        date,
        status,
      });

      await this.financesRepository.save(updatedFinance);

      return finance;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
