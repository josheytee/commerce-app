import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoreSectionService } from './store-section.service';
import { StoreSectionController } from './store-section.controller';
import { SectionModel } from 'src/infrastructure';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import { SectionRepository } from 'src/infrastructure/database/repositories';

@Module({
  imports: [UserVendorRoleModule, SequelizeModule.forFeature([SectionModel])],
  providers: [StoreSectionService, SectionRepository],
  controllers: [StoreSectionController],
  exports: [StoreSectionService, SectionRepository],
})
export class StoreSectionModule { }
