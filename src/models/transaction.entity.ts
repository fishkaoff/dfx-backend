import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum TransactionType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  transaction_type: TransactionType;

  @Column({
    nullable: false,
    type: 'float',
  })
  amount: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  constructor(transaction: Partial<Transaction>) {
    Object.assign(this, transaction);
  }
}