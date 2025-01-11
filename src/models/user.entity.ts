import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0.0, type: 'float' })
  balance: number;

  @Column({ default: 0.0, type: 'float' })
  can_spend_today: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
  transactions: Transaction[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}