// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Inventory } from 'src/modules/vendor/inventory/inventory.model';
import { OrderItem } from 'src/modules/vendor/order/models/order-item.model';
import { Order } from 'src/modules/vendor/order/models/order.model';

import { Section } from 'src/modules/vendor/section/section.model';
import { City } from 'src/modules/user/addresses/city/city.model';
import { State } from 'src/modules/user/addresses/state/state.model';
import { Country } from 'src/modules/user/addresses/country/country.model';
import { Address } from 'src/modules/user/addresses/address.model';
import { Cart } from 'src/modules/storefront/cart/models/cart.model';
import { ProductAttribute } from 'src/modules/vendor/products/attribute/models/product_attribute.model';
import { Attribute } from 'src/modules/vendor/products/attribute/models/attribute.model';
import { Rating } from 'src/modules/user/rating/models/rating.model';
import { Review } from 'src/modules/user/review/model/review.model';
import { Media } from 'src/modules/vendor/media/models/media.model';
import { Role } from 'src/modules/user/role/models/role.model';
import { User } from 'src/modules/user/user/models/user.model';
import { Permission } from 'src/modules/user/permission/permission.model';
import { Session } from 'src/modules/auth/session/session.model';
import { PasswordReset } from 'src/modules/user/password-reset/password-reset.model';
import { TwoFactorAuth } from 'src/modules/user/two-factor-auth/two-factor-auth.model';
import { AuditLog } from 'src/modules/user/audit-log/audit-log.model';
import { Category } from 'src/modules/storefront/categories/category.model';
import { Store } from 'src/modules/vendor/store/models/store.model';
import { StoreCustomer } from 'src/modules/vendor/store/models/store-customer.model';
import { Customer } from 'src/modules/user/customer/customer.model';
import { Vendor } from 'src/modules/vendor/onboarding/vendor.model';
import { Product } from 'src/modules/vendor/products/product.model';
import { UserStoreRole } from 'src/modules/vendor/store/models/user-store-role.model';
import { UserVendorRole } from 'src/modules/user/user-vendor-role/user-vendor-role.model';
import { UserVendorRolePermission } from 'src/modules/user/permission/user-vendor-role-permission.model';

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
                City,
                State,
                Country,
                Address,
                User,
                Role,
                Permission,
                Session,
                PasswordReset,
                TwoFactorAuth,
                AuditLog,
                Category,
                Store,
                StoreCustomer,
                Customer,
                Section,
                Vendor,
                Inventory,
                Media,
                Review,
                Rating,
                Product,
                Order,
                Cart,
                Attribute,
                ProductAttribute,
                OrderItem,
                UserStoreRole,
                UserVendorRole,
                UserVendorRolePermission,
            ],
        }),
    ],
})
export class DatabaseModule { }
