import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import HabitCheck from './HabitCheck';
import { weekDay } from '../../../dtos/EnumWeekDayDTO';

@Entity('habits')
class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  reminderQuestion: string;

  @Column()
  color: string;

  @Column()
  frequency: weekDay;

  @Column()
  reminder: boolean;

  @Column()
  pontuation: number;

  @OneToMany(
    () => HabitCheck,
    habitCheck => habitCheck.habit,
  )
  habitsCheck: HabitCheck[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Habit;
