import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';

@Module({
  imports: [UsersModule],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
