import { TypeFinance } from '../infra/typeorm/entities/Finance';

export default interface ICreateFinanceDTO {
  description: string;
  value: number;
  date: Date;
  status: boolean;
  type: TypeFinance;
  user_id: string;
}
