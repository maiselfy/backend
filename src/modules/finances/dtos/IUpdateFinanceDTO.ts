export default interface IUpdateFinanceDTO {
  description: string;
  value: number;
  date: Date;
  status: boolean;
  tags: Tag[];
}
