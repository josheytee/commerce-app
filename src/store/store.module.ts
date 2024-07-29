import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './models/store.model';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { SectionModule } from './section/section.module';
import { RolesGuard } from 'src/account/role/roles.guard';
import { RoleService } from 'src/account/role/role.service';
import { Role } from 'src/account/role/models/role.model';
import { Vendor } from 'src/account/vendor/vendor.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Vendor, Store]), SectionModule],
  providers: [StoreService, RolesGuard, RoleService],
  controllers: [StoreController],
})
export class StoreModule {}
