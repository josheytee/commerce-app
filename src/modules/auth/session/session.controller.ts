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
import { Session } from './session.model';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async findAll(): Promise<Session[]> {
    return this.sessionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Session> {
    return this.sessionService.findOne(id);
  }

  @Post()
  async create(@Body() session: Partial<Session>): Promise<Session> {
    return this.sessionService.create(session);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() session: Partial<Session>,
  ): Promise<[number]> {
    return this.sessionService.update(id, session);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.sessionService.remove(id);
  }
}
