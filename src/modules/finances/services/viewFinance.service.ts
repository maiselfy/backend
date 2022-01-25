import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Finance from '../infra/typeorm/entities/Finance';

@Injectable()
export default class ViewFinanceService {
  constructor(
    @InjectRepository(Finance) private financesRepository: Repository<Finance>,
  ) {}

  async execute(id: string, user_id: string): Promise<Finance> {
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

      return finance;
    } catch (error) {
      if (error) return error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
