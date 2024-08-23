// src/services/session.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './session.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(): Promise<Session[]> {
    return this.sessionModel.findAll();
  }

  async findOne(id: number): Promise<Session> {
    return this.sessionModel.findByPk(id);
  }

  async create(session: Partial<Session>): Promise<Session> {
    return this.sessionModel.create(session);
  }

  async update(id: number, session: Partial<Session>): Promise<[number]> {
    return this.sessionModel.update(session, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const session = await this.sessionModel.findByPk(id);
    if (session) {
      await session.destroy();
    }
  }
}
