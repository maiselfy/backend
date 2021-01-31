import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import User from './User.entity';
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

  @OneToOne(
    () => User,
    user => user.body,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
export default Bodies;
