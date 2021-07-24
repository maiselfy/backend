import HabitDayCheck from '../infra/typeorm/entities/HabitDayCheck';

export default interface IViewHabitDTO {
  name: string;
  description: string;
  objective: string;
  color: string;
  buddy_id: string;
  frequency: HabitDayCheck[];
}
