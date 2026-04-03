// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel } from 'src/infrastructure/database/models/inventory.model';

import { SectionModel } from 'src/infrastructure/database/models/section.model';
import { CityModel } from 'src/infrastructure/database/models/city.model';
import { StateModel } from 'src/infrastructure/database/models/state.model';
import { CountryModel } from 'src/infrastructure/database/models/country.model';
import { AddressModel } from 'src/infrastructure/database/models/address.model';
import { CartModel } from 'src/infrastructure/database/models/cart.model';
import { ProductAttributeModel } from 'src/infrastructure/database/models/product-attribute.model';
import { AttributeModel } from 'src/infrastructure/database/models/attribute.model';
import { RatingModel } from 'src/infrastructure/database/models/rating.model';
import { ReviewModel } from 'src/infrastructure/database/models/review.model';
import { MediaModel } from 'src/infrastructure/database/models/media.model';
import { RoleModel } from 'src/infrastructure/database/models/role.model';
import { UserModel } from 'src/infrastructure/database/models/user.model';
import { PermissionModel } from 'src/infrastructure/database/models/permission.model';
import { SessionModel } from 'src/infrastructure/database/models/session.model';
import { PasswordResetModel } from 'src/infrastructure/database/models/password-reset.model';
import { TwoFactorAuthModel } from 'src/infrastructure/database/models/two-factor-auth.model';
import { AuditLogModel } from 'src/infrastructure/database/models/audit-log.model';
import { CategoryModel } from 'src/infrastructure/database/models/category.model';
import { StoreModel } from 'src/infrastructure/database/models/store.model';
import { StoreCustomer } from 'src/infrastructure/database/models/store-customer.model';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { VendorModel } from 'src/infrastructure/database/models/vendor.model';
import { ProductModel } from 'src/infrastructure/database/models/product.model';
import { UserStoreRoleModel } from 'src/infrastructure/database/models/user-store-role.model';
import { UserVendorRoleModel } from 'src/infrastructure/database/models/user-vendor-role.model';
import { UserVendorRolePermissionModel } from 'src/infrastructure/database/models/user-vendor-role-permission.model';
import { DiscountModel, OrderItemModel, OrderModel, ProductVariantModel, TagModel } from './models';
import { SectionRepository } from './repositories';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USER || 'macpro',
            password: process.env.DB_PASSWORD || '12345678',
            database: process.env.DB_NAME || 'jart',
            // url: process.env.DATABASE_URL,
            autoLoadModels: false,
            synchronize: false,
            // dialectOptions: {
            //   ssl: {
            //     require: process.env.ENV != 'dev',
            //     rejectUnauthorized: false,
            //   },
            // },
            // logging: console.log,
            models: [
                CityModel,
                StateModel,
                CountryModel,
                AddressModel,
                UserModel,
                RoleModel,
                PermissionModel,
                SessionModel,
                PasswordResetModel,
                TwoFactorAuthModel,
                AuditLogModel,
                CategoryModel,
                StoreModel,
                StoreCustomer,
                CustomerModel,
                SectionModel,
                VendorModel,
                InventoryModel,
                MediaModel,
                ReviewModel,
                RatingModel,
                ProductVariantModel,
                ProductModel,
                DiscountModel,
                TagModel,
                OrderModel,
                CartModel,
                AttributeModel,
                ProductAttributeModel,
                OrderItemModel,
                UserStoreRoleModel,
                UserVendorRoleModel,
                UserVendorRolePermissionModel,
            ],
        }),
    ],
    // providers: [SectionRepository],
    // exports: [SectionRepository],
})
export class DatabaseModule { }
