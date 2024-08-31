import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Section } from './section.model';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { UserVendorRoleModule } from 'src/account/user-vendor-role/user-vendor-role.module';

@Module({
  imports: [UserVendorRoleModule, SequelizeModule.forFeature([Section])],
  providers: [SectionService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule {}
