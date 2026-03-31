// src/services/password-reset.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordResetModel } from 'src/infrastructure';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(PasswordResetModel)
    private readonly passwordResetModel: typeof PasswordResetModel,
  ) { }

  async findAll(): Promise<PasswordResetModel[]> {
    return this.passwordResetModel.findAll();
  }

  async findOne(id: number): Promise<PasswordResetModel> {
    return this.passwordResetModel.findByPk(id);
  }

  async create(
    passwordReset: Partial<PasswordResetModel>,
  ): Promise<PasswordResetModel> {
    return this.passwordResetModel.create(passwordReset);
  }

  async update(
    id: number,
    passwordReset: Partial<PasswordResetModel>,
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
