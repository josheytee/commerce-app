// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../account/user/models/user.model';
import { Role } from '../account/role/models/role.model';
import { Permission } from '../account/permission/permission.model';
import { Session } from '../account/session/session.model';
import { PasswordReset } from '../account/password-reset/password-reset.model';
import { TwoFactorAuth } from '../account/two-factor-auth/two-factor-auth.model';
import { AuditLog } from '../account/audit-log/audit-log.model';
import { Store } from 'src/store/models/store.model';
import { Inventory } from 'src/inventory/inventory.model';
import { Product } from 'src/product/product.model';
import { OrderItem } from 'src/order/models/order-item.model';
import { Order } from 'src/order/models/order.model';
import { StoreCustomer } from 'src/store/models/store-customer.model';
import { Customer } from 'src/account/customer/customer.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { Section } from 'src/section/section.model';
import { Category } from 'src/store/models/category.model';
import { UserStoreRole } from 'src/store/models/user-store-role.model';
import { UserVendorRole } from 'src/account/user-vendor-role/user-vendor-role.model';
import { UserVendorRolePermission } from 'src/account/permission/user-vendor-role-permission.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'commerce-app',
      autoLoadModels: true,
      synchronize: true,
      // logging: console.log,
      models: [
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
        Product,
        Order,
        OrderItem,
        UserStoreRole,
        UserVendorRole,
        UserVendorRolePermission,
      ],
    }),
  ],
})
export class DatabaseModule {}
