import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('bodies')
class Bodies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  user_id: string;

  @ManyToOne(
    () => User,
    user => user.bodies,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
export default Bodies;
