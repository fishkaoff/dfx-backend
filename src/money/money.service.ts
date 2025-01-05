import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserModel } from '../models/UserModel';
import { UsersService } from '../users/users.service';
import { EditMoneyDto } from './dtos/edit-money.dto';

@Injectable()
export class MoneyService {
  constructor(private readonly usersService: UsersService) {
  }

  async addMoney({ id, amount }: EditMoneyDto): Promise<UserModel> {
    const user = await this.usersService.getById(id);
    if (!user) throw new BadRequestException('User not found');

    user.balance += amount;
    user.can_spend_today = this.recalculateAvailableMoney(user.balance, this.getDaysUntilPayday());

    return await this.usersService.update(user);
  }

  async withdraw({ id, amount }: EditMoneyDto): Promise<UserModel> {
    const user = await this.usersService.getById(id);
    if (!user) throw new BadRequestException('User not found');
    if (user.balance < amount) throw new BadRequestException('Current balance is lower than amount');

    user.balance -= amount;
    user.can_spend_today -= amount;

    return await this.usersService.update(user);
  }

  private recalculateAvailableMoney(balance: number, daysUntilPayday: number): number {
    const fixedNum = (balance / daysUntilPayday).toFixed(2);
    return parseFloat(fixedNum);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async dailySpendsRecalculation() {
    console.info('Started daily spends recalculation');
    const users = await this.usersService.getAll();
    const daysUntilPayday = this.getDaysUntilPayday();

    for (let user of users) {
      user.can_spend_today = this.recalculateAvailableMoney(user.balance, daysUntilPayday);
      await this.usersService.update(user);
    }

    console.info('Finished daily spends recalculation');
  }

  private getDaysUntilPayday(): number {
    const currentDate: Date = new Date();
    const currentMonth: number = currentDate.getMonth();
    const currentYear: number = currentDate.getFullYear();

    const targetDate25: Date = new Date(currentYear, currentMonth, 25);
    const targetDate10NextMonth: Date = new Date(currentYear, currentMonth + 1, 10);

    let daysDifference: number;

    if (currentDate > targetDate25) {
      // Если 25 число уже прошло, считаем до 10 числа следующего месяца
      daysDifference = Math.ceil((targetDate10NextMonth.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    } else {
      // Если 25 число еще не прошло, считаем до 25 числа текущего месяца
      daysDifference = Math.ceil((targetDate25.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    }

    return daysDifference;
  }
}
