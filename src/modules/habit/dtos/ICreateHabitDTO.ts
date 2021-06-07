export default interface ICreateHabitDTO {
  userId: string;
  name: string;
  description: string;
  reminderQuestion: string;
  color: string;
  frequency: string;
  reminder: boolean;
  pontuation: number;
}
