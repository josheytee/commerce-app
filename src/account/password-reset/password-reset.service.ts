// src/services/password-reset.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordReset } from './password-reset.model';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(PasswordReset)
    private readonly passwordResetModel: typeof PasswordReset,
  ) {}

  async findAll(): Promise<PasswordReset[]> {
    return this.passwordResetModel.findAll();
  }

  async findOne(id: number): Promise<PasswordReset> {
    return this.passwordResetModel.findByPk(id);
  }

  async create(passwordReset: Partial<PasswordReset>): Promise<PasswordReset> {
    return this.passwordResetModel.create(passwordReset);
  }

  async update(
    id: number,
    passwordReset: Partial<PasswordReset>,
  ): Promise<[number]> {
    return this.passwordResetModel.update(passwordReset, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const passwordReset = await this.passwordResetModel.findByPk(id);
    if (passwordReset) {
      await passwordReset.destroy();
    }
  }
}
