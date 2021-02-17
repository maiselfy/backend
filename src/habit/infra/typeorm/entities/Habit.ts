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

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  reminder_question: string;

  @Column()
  color: string;

  @Column()
  frequency: Int16Array;

  @Column()
  reminder: string;

  @Column()
  pontuation: Int16Array;

  // Processo para reminder similar ao de body ?

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Habit;
