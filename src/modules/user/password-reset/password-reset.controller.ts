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
import { PasswordResetModel } from 'src/infrastructure';

@Controller('password-resets')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) { }

  @Get()
  async findAll(): Promise<PasswordResetModel[]> {
    return this.passwordResetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PasswordResetModel> {
    return this.passwordResetService.findOne(id);
  }

  @Post()
  async create(
    @Body() passwordReset: Partial<PasswordResetModel>,
  ): Promise<PasswordResetModel> {
    return this.passwordResetService.create(passwordReset);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() passwordReset: Partial<PasswordResetModel>,
  ): Promise<[number]> {
    return this.passwordResetService.update(id, passwordReset);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.passwordResetService.remove(id);
  }
}
