import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/dtos/auth.dto';
import { UserModel } from '../models/UserModel';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserModel>,
  ) {
  }

  async getByEmail(email: string): Promise<UserModel> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async getById(id: string): Promise<UserModel> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async create(dto: AuthDto): Promise<UserModel> {
    const user = {
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    };

    return this.usersRepository.save(user);
  }

  async update(user: UserModel): Promise<UserModel> {
    return this.usersRepository.save(user);
  }

  async getAll(): Promise<UserModel[]> {
    return await this.usersRepository.find();
  }

}
