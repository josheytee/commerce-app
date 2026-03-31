import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserSearchCriteria } from './interfaces/user-search-criteria.interface';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { JartException } from 'src/all-exceptions.filter';
import { UserModel } from 'src/infrastructure';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) { }

  async findAll(): Promise<UserModel[]> {
    return this.userModel.findAll();
  }

  async findOne(criteria: UserSearchCriteria): Promise<UserModel | null> {
    return this.userModel.findOne({ where: criteria as any });
  }

  async create(userPayload: Partial<CreateUserDto>): Promise<UserModel> {
    const user = { ...userPayload, password_hash: null };

    const found = await this.findOne({ email: userPayload.email });

    if (found && found !== null)
      throw new JartException('Email already exists, Kindly use another email');

    if (userPayload.password) {
      const saltRounds = 10;
      user.password_hash = await bcrypt.hash(user.password, saltRounds);
    }

    // Create user
    const newUser = await this.userModel.create(user);

    // Convert to JSON and remove sensitive data
    return newUser;
  }

  async update(id: number, updateData: Partial<UserModel>): Promise<UserModel | null> {
    const [numberOfAffectedRows] = await this.userModel.update(updateData, {
      where: { id },
    });

    if (numberOfAffectedRows === 0) {
      return null; // No rows affected
    }

    return this.userModel.findByPk(id); // Fetch the updated user
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }
}
