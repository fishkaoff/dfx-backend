import { Controller, HttpCode, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

class UserInfoDto {
  @IsUUID()
  id: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }


  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async userInfo(dto: UserInfoDto) {
    const { password, ...user } = await this.usersService.getById(dto.id);
    return user;
  }

}
