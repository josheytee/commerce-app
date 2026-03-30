// src/controllers/two-factor-auth.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuth } from './two-factor-auth.model';

@Controller('two-factor-auths')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Get()
  async findAll(): Promise<TwoFactorAuth[]> {
    return this.twoFactorAuthService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TwoFactorAuth> {
    return this.twoFactorAuthService.findOne(id);
  }

  @Post()
  async create(
    @Body() twoFactorAuth: Partial<TwoFactorAuth>,
  ): Promise<TwoFactorAuth> {
    return this.twoFactorAuthService.create(twoFactorAuth);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() twoFactorAuth: Partial<TwoFactorAuth>,
  ): Promise<[number]> {
    return this.twoFactorAuthService.update(id, twoFactorAuth);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.twoFactorAuthService.remove(id);
  }
}
