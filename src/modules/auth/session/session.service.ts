import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  CustomerModel,
  RoleModel,
  SessionModel,
  StoreModel,
  UserModel,
  VendorModel,
} from 'src/infrastructure';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionModel)
    private readonly sessionModel: typeof SessionModel,
  ) { }

  async findSessionByToken(token: string): Promise<SessionModel | null> {
    return this.sessionModel.findOne({
      where: { token },
      include: [
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: VendorModel,
              as: 'vendors',
              through: { attributes: [] },
              include: [
                {
                  model: StoreModel,
                  as: 'stores',
                },
              ],
            },
            {
              model: CustomerModel,
              as: 'customer',
            },
            {
              model: RoleModel,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  async createSession(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<SessionModel> {
    return this.sessionModel.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }

  async findAll(): Promise<SessionModel[]> {
    return this.sessionModel.findAll();
  }

  async findOne(id: number): Promise<SessionModel> {
    return this.sessionModel.findByPk(id);
  }
  async findByUserId(user_id: number): Promise<SessionModel[]> {
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

  async create(session: Partial<SessionModel>): Promise<SessionModel> {
    return this.sessionModel.create(session);
  }

  async update(id: number, session: Partial<SessionModel>): Promise<[number]> {
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
