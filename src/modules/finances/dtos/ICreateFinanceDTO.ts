import { TypeFinance } from '../infra/typeorm/entities/Finance';

import Tag from '../infra/typeorm/entities/Tag';

export default interface ICreateFinanceDTO {
  description: string;
  value: number;
  date: Date;
  status: boolean;
  type: TypeFinance;
  tags: Tag[];
  user_id: string;
}
