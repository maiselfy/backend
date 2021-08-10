import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('friendship')
class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  from_user_id: string;

  @Column('uuid')
  to_user_id: string;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

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
