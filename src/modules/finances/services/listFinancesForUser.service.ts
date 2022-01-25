import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import User from '../../user/infra/typeorm/entities/User';
import Finance from '../infra/typeorm/entities/Finance';

@Injectable()
export default class ListFinancesService {
  constructor(
    @InjectRepository(Finance) private financesRepository: Repository<Finance>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async execute(user_id: string): Promise<Finance[]> {
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

      const allFinances = await this.financesRepository.find({
        where: { user_id },
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

      return allFinances;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
