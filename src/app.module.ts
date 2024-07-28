import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { StoreModule } from './store/store.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    DatabaseModule,
    AccountModule,
    StoreModule,
    ProductModule,
    InventoryModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
