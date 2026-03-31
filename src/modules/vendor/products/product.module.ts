import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel, UserVendorRoleModel } from 'src/infrastructure';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';

@Module({
  imports: [
    UserVendorRoleModule,
    SequelizeModule.forFeature([ProductModel, UserVendorRoleModel]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
