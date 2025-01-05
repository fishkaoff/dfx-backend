import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'node:process';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'asdkl;d03294-A)(sidA()234ipad',
    });
  }

  async validate({ id }: { id: string }) {
    const user = await this.usersService.getById(id);
    if (!user) throw new BadRequestException('User not found');

    return user;
  }
}