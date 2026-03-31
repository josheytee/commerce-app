// src/services/two-factor-auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TwoFactorAuthModel } from 'src/infrastructure';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectModel(TwoFactorAuthModel)
    private readonly twoFactorAuthModel: typeof TwoFactorAuthModel,
  ) { }

  async findAll(): Promise<TwoFactorAuthModel[]> {
    return this.twoFactorAuthModel.findAll();
  }

  async findOne(id: number): Promise<TwoFactorAuthModel> {
    return this.twoFactorAuthModel.findByPk(id);
  }

  async create(twoFactorAuth: Partial<TwoFactorAuthModel>): Promise<TwoFactorAuthModel> {
    return this.twoFactorAuthModel.create(twoFactorAuth);
  }

  async update(
    id: number,
    twoFactorAuth: Partial<TwoFactorAuthModel>,
  ): Promise<[number]> {
    return this.twoFactorAuthModel.update(twoFactorAuth, {
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    const twoFactorAuth = await this.twoFactorAuthModel.findByPk(id);
    if (twoFactorAuth) {
      await twoFactorAuth.destroy();
    }
  }
}
