import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EditMoneyDto } from './dtos/edit-money.dto';
import { NewTransactionDto } from './dtos/transaction.dto';
import { MoneyService } from './money.service';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('transaction')
  async transaction(@Body() body: NewTransactionDto) {
    return await this.moneyService.newTransaction(body);
  }
}
