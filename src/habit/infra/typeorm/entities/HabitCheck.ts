import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Habit from './Habit';

@Entity('habit_check')
class HabitCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  habit_id: string;

  @Column()
  done: boolean;

  @Column()
  date: Date;

  @ManyToOne(
    () => Habit,
    habit => habit.habitsCheck,
  )
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default HabitCheck;
