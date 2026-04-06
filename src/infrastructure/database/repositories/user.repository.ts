import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { UserModel } from '../models';

@Injectable()
export class UserRepository extends BaseRepository<UserModel> {
    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel,
    ) {
        super(userModel);
    }
}
