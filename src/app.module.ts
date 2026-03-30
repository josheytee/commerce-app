import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InventoryModule } from './modules/vendor/inventory/inventory.module';
import { OrderModule } from './modules/vendor/order/order.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ResponseInterceptor } from './response.interceptor';
import { SectionModule } from './modules/vendor/section/section.module';
import { WinstonModule } from 'nest-winston';
import { AddressModule } from './modules/user/addresses/address.module';
import { CartModule } from './modules/storefront/cart/cart.module';
import { AttributeModule } from './modules/vendor/products/attribute/attribute.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { MediaModule } from './modules/vendor/media/media.module';
import { RatingModule } from './modules/user/rating/rating.module';
import { ReviewModule } from './modules/user/review/review.module';
import { RequestIdMiddleware } from './request-id-middleware';
import { CategoryModule } from './modules/storefront/categories/category.module';
import { StoreModule } from './modules/vendor/store/store.module';
import { ProductModule } from './modules/vendor/products/product.module';
import { PaymentModule } from './infrastructure/payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
