import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../models/transaction.entity';
import { User } from '../models/user.entity';
import { UsersService } from '../users/users.service';
import { NewTransactionDto } from './dtos/transaction.dto';

@Injectable()
export class MoneyService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) {
  }

  async newTransaction(dto: NewTransactionDto) {
    const foundUser = await this.usersService.getById(dto.userId);
    if (!foundUser) throw new NotFoundException('User not found');

    const transaction = new Transaction(dto);

    let user: User;

    if (dto.transaction_type == TransactionType.DEPOSIT) {
      user = this.deposit(foundUser, dto.amount);
    } else {
      user = this.transfer(foundUser, dto.amount);
    }
    transaction.user = user;


    // TODO: compare in transaction
    await this.usersService.update(user);
    await this.transactionRepository.save(transaction);

    return this.usersService.getById(dto.userId);
  }

  private deposit = (user: User, amount: number): User => {
    user.balance += amount;
    user.can_spend_today = this.recalculateAvailableMoney(user.balance, this.getDaysUntilPayday());
    return user;
  };

  private transfer = (user: User, amount: number): User => {
    user.balance -= amount;
    user.can_spend_today = this.recalculateAvailableMoney(user.balance, this.getDaysUntilPayday());
    return user;
  };

  private recalculateAvailableMoney(balance: number, daysUntilPayday: number): number {
    const fixedNum = (balance / daysUntilPayday).toFixed(2);
    return parseFloat(fixedNum);
  }

  // TODO: Need fix
  // When date is about 20, 23 returns incorrect data
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

}
