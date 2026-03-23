import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserVendorRole } from 'src/account/user-vendor-role/user-vendor-role.model';
import { UserVendorRoleModule } from 'src/account/user-vendor-role/user-vendor-role.module';

@Module({
  imports: [
    UserVendorRoleModule,
    SequelizeModule.forFeature([Product, UserVendorRole]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
