import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EditMoneyDto } from './dtos/edit-money.dto';
import { MoneyService } from './money.service';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('top-up')
  async topUp(@Body() body: EditMoneyDto) {
    const { password, ...user } = await this.moneyService.addMoney(body);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('withdraw')
  async withdraw(@Body() body: EditMoneyDto) {
    const { password, ...user } = await this.moneyService.withdraw(body);
    return user;
  }
}
