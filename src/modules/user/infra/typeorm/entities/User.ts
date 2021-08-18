/* eslint-disable prettier/prettier */
import { Exclude, Expose } from 'class-transformer';
import Friendship from 'src/modules/friendship/infra/typeorm/entities/Friendship';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @Exclude()
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

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Expose()
  get fullName(): string {
    return `${this.name} ${this.lastname}`;
  }
}

export default User;
