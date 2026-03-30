// src/services/two-factor-auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TwoFactorAuth } from './two-factor-auth.model';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectModel(TwoFactorAuth)
    private readonly twoFactorAuthModel: typeof TwoFactorAuth,
  ) {}

  async findAll(): Promise<TwoFactorAuth[]> {
    return this.twoFactorAuthModel.findAll();
  }

  async findOne(id: number): Promise<TwoFactorAuth> {
    return this.twoFactorAuthModel.findByPk(id);
  }

  async create(twoFactorAuth: Partial<TwoFactorAuth>): Promise<TwoFactorAuth> {
    return this.twoFactorAuthModel.create(twoFactorAuth);
  }

  async update(
    id: number,
    twoFactorAuth: Partial<TwoFactorAuth>,
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
