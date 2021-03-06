import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../user/infra/typeorm/entities/User';
import { Repository } from 'typeorm';
import ICreateFinanceDTO from '../dtos/ICreateFinanceDTO';
import Finance from '../infra/typeorm/entities/Finance';
import Tag from '../infra/typeorm/entities/Tag';

@Injectable()
export default class CreateFinanceService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Finance) private financesRepository: Repository<Finance>,
  ) {}

  async execute({
    description,
    value,
    date,
    status,
    type,
    user_id,
  }: ICreateFinanceDTO): Promise<Finance> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user)
        throw new HttpException(
          'It is not possible to perform the operation, as there is no corresponding registered user',
          HttpStatus.NOT_FOUND,
        );

      const finance = this.financesRepository.create({
        description,
        value,
        date,
        status,
        type,
        user_id,
      });

      await this.financesRepository.save(finance);

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
