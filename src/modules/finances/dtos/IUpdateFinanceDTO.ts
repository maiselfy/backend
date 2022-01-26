import Tag from '../infra/typeorm/entities/Tag';

export default interface IUpdateFinanceDTO {
  description: string;
  value: number;
  date: Date;
  status: boolean;
}
