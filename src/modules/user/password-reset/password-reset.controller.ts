// src/controllers/password-reset.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordReset } from './password-reset.model';

@Controller('password-resets')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Get()
  async findAll(): Promise<PasswordReset[]> {
    return this.passwordResetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PasswordReset> {
    return this.passwordResetService.findOne(id);
  }

  @Post()
  async create(
    @Body() passwordReset: Partial<PasswordReset>,
  ): Promise<PasswordReset> {
    return this.passwordResetService.create(passwordReset);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() passwordReset: Partial<PasswordReset>,
  ): Promise<[number]> {
    return this.passwordResetService.update(id, passwordReset);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.passwordResetService.remove(id);
  }
}
