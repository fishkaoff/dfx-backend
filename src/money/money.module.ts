import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../models/transaction.entity';
import { User } from '../models/user.entity';
import { UsersModule } from '../users/users.module';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Transaction, User])],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {
}
