import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuthDto } from '../auth/dtos/auth.dto';
import { User } from '../models/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        transactions: true,
      },
    });

    if (user) {
      user.transactions.reverse();
    }
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        transactions: true,
      },
    });

    if (user) {
      user.transactions.reverse();
    }
    return user;
  }

  async create(dto: AuthDto): Promise<User> {
    const user = new User({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      transactions: [],
    });

    return this.usersRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

}
