import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './models/store.model';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { SectionModule } from './section/section.module';
import { VendorModule } from 'src/store/vendor/vendor.module';

@Module({
  imports: [SequelizeModule.forFeature([Store]), SectionModule, VendorModule],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
