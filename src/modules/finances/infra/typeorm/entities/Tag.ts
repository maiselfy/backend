/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import User from 'src/modules/user/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Finance from './Finance';

@Entity('tags')
class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  icon: string;

  @Column('uuid')
  finance_id: string;

  @ManyToOne(
    () => Finance,
    finance => finance.tags,
  )

  @JoinColumn({ name: 'finance_id' })
  finance: Finance;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Tag;
