import { weekDay } from './EnumWeekDayDTO';
export default interface IUpdateHabitDTO {
  name: string;
  description: string;
  reminderQuestion: string;
  color: string;
  frequency: weekDay;
  reminder: boolean;
  pontuation: number;
}
