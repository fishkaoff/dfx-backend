import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0.0, type: "float" })
  balance: number;

  @Column({ default: 0.0, type: "float" })
  can_spend_today: number;
}