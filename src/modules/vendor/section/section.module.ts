import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import { SectionModel } from 'src/infrastructure';

@Module({
  imports: [UserVendorRoleModule, SequelizeModule.forFeature([SectionModel])],
  providers: [SectionService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule { }
