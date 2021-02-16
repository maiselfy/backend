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

  //@Column()
  //reminder_question:

  //@Column()
  //color:

  //frequency:


  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Habit;
