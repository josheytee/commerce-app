import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import { UserVendorRole } from 'src/modules/user/user-vendor-role/user-vendor-role.model';


@Module({
  imports: [
    UserVendorRoleModule,
    SequelizeModule.forFeature([Product, UserVendorRole]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
