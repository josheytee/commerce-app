import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { RequestIdMiddleware } from './shared/middleware/request-id-middleware';
import { AuthModule, StorefrontModule, VendorModule } from './modules';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    StorefrontModule,
    VendorModule,
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
