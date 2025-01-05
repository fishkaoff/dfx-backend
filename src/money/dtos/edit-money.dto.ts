import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class EditMoneyDto {
  @IsUUID()
  @IsNotEmpty({message: "id cannot be empty"})
  id: string

  @IsNumber()
  @IsPositive({
    message: 'Amount must be a positive number',
  })
  amount: number
}