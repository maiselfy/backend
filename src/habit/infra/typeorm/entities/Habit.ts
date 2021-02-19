import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  frequency: string;

  @Column()
  reminder: boolean;

  @Column()
  pontuation: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Habit;
