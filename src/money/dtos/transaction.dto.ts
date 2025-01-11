import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive, IsString,
  IsUUID, MaxLength,
  MinLength,
} from 'class-validator';
import { TransactionType } from '../../models/transaction.entity';

export class NewTransactionDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(3, {
    message: 'description should be at least 3 characters',
  })
  @MaxLength(100, {
    message: 'description max length 100 characters',
  })
  description: string;

  @IsNotEmpty({ message: 'transaction type must be provided' })
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @IsNumber()
  @IsPositive({ message: 'amount must be a positive number' })
  amount: number;
}
