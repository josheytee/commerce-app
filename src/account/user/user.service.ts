// src/services/userService.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserSearchCriteria } from './interfaces/user-search-criteria.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(criteria: UserSearchCriteria): Promise<User | null> {
    return this.userModel.findOne({ where: criteria as any });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async update(id: number, user: Partial<User>) {
    // console.log(user, id, await this.userModel.update(user, { where: { id } }));
    return await this.userModel.update(user, {
      returning: true,
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }
}
