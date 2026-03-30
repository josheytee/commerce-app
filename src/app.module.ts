import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InventoryModule } from './modules/vendor/inventory/inventory.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { SectionModule } from './modules/vendor/section/section.module';
import { WinstonModule } from 'nest-winston';
import { AddressModule } from './modules/user/addresses/address.module';
import { CartModule } from './modules/storefront/cart/cart.module';
import { AttributeModule } from './modules/vendor/products/attribute/attribute.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { RequestIdMiddleware } from './request-id-middleware';
import { PaymentModule } from './infrastructure/payment/payment.module';
import { StorefrontModule } from './modules';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    StorefrontModule,
    WinstonModule,
    WebhookModule,
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
