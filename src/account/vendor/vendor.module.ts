import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';

@Module({
  imports: [SequelizeModule.forFeature([Vendor])],
  providers: [VendorService],
  controllers: [VendorController],
})
export class VendorModule {}
