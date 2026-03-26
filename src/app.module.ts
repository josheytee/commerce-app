import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { StoreModule } from './store/store.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ResponseInterceptor } from './response.interceptor';
import { SectionModule } from './section/section.module';
import { WinstonModule } from 'nest-winston';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { AttributeModule } from './attribute/attribute.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { CategoryModule } from './category/category.module';
import { MediaModule } from './media/media.module';
import { RatingModule } from './rating/rating.module';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AccountModule,
    CategoryModule,
    StoreModule,
    SectionModule,
    ProductModule,
    InventoryModule,
    OrderModule,
    WinstonModule,
    AddressModule,
    CartModule,
    AttributeModule,
    PaymentModule,
    WebhookModule,
    MediaModule,
    ReviewModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    Logger,
    AppService,
  ],
})
export class AppModule { }
