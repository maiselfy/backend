/* eslint-disable prettier/prettier */
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum TypeFinance {
  INPUT = 'input',
  OUTPUT = 'output',
}

@Entity('finances')
class Finance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  value: float;

  @Column()
  date: Date;

  @Column()
  status: boolean;

  @Column({
    type: "enum",
    enum: TypeFinance,
    default: TypeFinance.INPUT
  })
  type: TypeFinance;

  @OneToMany(
    () => Tag,
    tag => tag.user,
  )
  tags: Tag[];

  @Column()
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export default Finance;
