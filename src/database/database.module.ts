// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../account/user/models/user.model';
import { Role } from '../account/role/models/role.model';
import { UserRole } from '../account/role/models/user-role.model';
import { Permission } from '../account/role/models/permission.model';
import { RolePermission } from '../account/role/models/role-permission.model';
import { Session } from '../account/session/session.model';
import { PasswordReset } from '../account/password-reset/password-reset.model';
import { TwoFactorAuth } from '../account/two-factor-auth/two-factor-auth.model';
import { AuditLog } from '../account/audit-log/audit-log.model';
import { Vendor } from 'src/store/vendor/vendor.model';
import { Store } from 'src/store/models/store.model';
import { Section } from 'src/store/section/section.model';
import { Inventory } from 'src/inventory/inventory.model';
import { Product } from 'src/product/product.model';
import { OrderItem } from 'src/order/models/order-item.model';
import { Order } from 'src/order/models/order.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'commerce-app',
      // autoLoadModels: true,
      // synchronize: true,
      models: [
        User,
        Role,
        UserRole,
        Permission,
        RolePermission,
        Session,
        PasswordReset,
        TwoFactorAuth,
        AuditLog,
        Store,
        Section,
        Vendor,
        Inventory,
        Product,
        Order,
        OrderItem,
      ],
    }),
  ],
})
export class DatabaseModule {}
