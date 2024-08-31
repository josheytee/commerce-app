// src/services/session.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './session.model';
import { Op } from 'sequelize';
import { now } from 'sequelize/types/utils';
import { User } from '../user/models/user.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findSessionByToken(token: string): Promise<Session | null> {
    return this.sessionModel.findOne({ where: { token }, include: [User] });
  }

  async createSession(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<Session> {
    return this.sessionModel.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }

  async findAll(): Promise<Session[]> {
    return this.sessionModel.findAll();
  }

  async findOne(id: number): Promise<Session> {
    return this.sessionModel.findByPk(id);
  }
  async findByUserId(user_id: number): Promise<Session[]> {
    const now = new Date();
    return this.sessionModel.findAll({
      where: {
        user_id,
        expires_at: {
          [Op.lt]: now, // Less than current time
        },
      },
    });
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
  async removeByToken(token: string): Promise<void> {
    const session = await this.findSessionByToken(token);
    if (session) {
      await session.destroy();
    }
  }

  async deleteExpiredSessions(userId: number): Promise<void> {
    const now = new Date();

    await this.sessionModel.destroy({
      where: {
        user_id: userId,
        expires_at: {
          [Op.lt]: now, // Less than current time
        },
      },
    });
  }
}
