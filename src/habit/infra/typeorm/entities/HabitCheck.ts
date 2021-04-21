import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default HabitCheck;
