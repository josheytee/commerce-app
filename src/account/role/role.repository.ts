// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/database/repositories/base.repository';
import { Role } from './models/role.model';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
    constructor(
        @InjectModel(Role)
        private roleModel: typeof Role,
    ) {
        super(roleModel);
    }


}
