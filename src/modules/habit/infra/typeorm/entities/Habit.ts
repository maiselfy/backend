import User from '../../../../user/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import HabitDayCheck from './HabitDayCheck';

@Entity('habits')
class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  objective: string;

  @Column()
  color: string;

  @Column()
  buddy_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'buddy_id' })
  buddy: User;

  @OneToMany(
    () => HabitDayCheck,
    habit => habit.habit_id,
  )
  frequency: HabitDayCheck[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Habit;
