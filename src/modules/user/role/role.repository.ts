import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from 'src/infrastructure';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';

@Injectable()
export class RoleRepository extends BaseRepository<RoleModel> {
    constructor(
        @InjectModel(RoleModel)
        private roleModel: typeof RoleModel,
    ) {
        super(roleModel);
    }


}
