import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user-tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  @Generated('uuid')
  token: string;

  @CreateDateColumn({ type: 'date' })
  expires_in: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  
  /*
  constructor(userToken?: Partial<UserToken>) {
    this.token = userToken.token;
    this.expires_in = new Date(2030, 10, 10);
  }
  */
}

export default UserToken;
