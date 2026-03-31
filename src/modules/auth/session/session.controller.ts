// src/controllers/session.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionModel } from 'src/infrastructure';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Get()
  async findAll(): Promise<SessionModel[]> {
    return this.sessionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SessionModel> {
    return this.sessionService.findOne(id);
  }

  @Post()
  async create(@Body() session: Partial<SessionModel>): Promise<SessionModel> {
    return this.sessionService.create(session);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() session: Partial<SessionModel>,
  ): Promise<[number]> {
    return this.sessionService.update(id, session);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.sessionService.remove(id);
  }
}
