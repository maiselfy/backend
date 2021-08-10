/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Body from './Body';
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  birthdate: Date;

  @OneToMany(
    () => Body,
    body => body.user,
  )
  bodies: Body[];

  @Column()
  avatar: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  /*
  constructor(user?: Partial<User>) {
    this.name = user.name;
    this.username = user.username;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.birthdate = user.birthdate;
  }
  */
}
export default User;
