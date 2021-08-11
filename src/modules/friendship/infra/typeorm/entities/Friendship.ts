import { Exclude, Transform } from 'class-transformer';
import User from 'src/modules/user/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('friendship')
class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column('uuid')
  from_user_id: string;

  @Exclude()
  @Column('uuid')
  to_user_id: string;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Transform(({ value }) => ({
    id: value.id,
    fullname: value.fullName,
    email: value.email,
  }))
  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @Transform(({ value }) => ({
    id: value.id,
    fullname: value.fullName,
    email: value.email,
  }))
  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  /*constructor(friendship?: Partial<Friendship>) {
    this.id = friendship?.id;
    this.from_user_id = friendship?.from_user_id;
    this.to_user_id = friendship?.to_user_id;
    this.status = friendship?.status;
    this.created_at = friendship?.created_at;
    this.updated_at = friendship.updated_at;
  }
  */
}

export default Friendship;
