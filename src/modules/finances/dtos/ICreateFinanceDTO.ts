import { TypeFinance } from '../infra/typeorm/entities/Finance';
import Tag from '../infra/typeorm/entities/Tag';

export default interface ICreateFinanceDTO {
  description: string;
  value: float;
  date: Date;
  status: boolean;
  type: TypeFinance;
  tags: Tag[];
  userId: string;
}
