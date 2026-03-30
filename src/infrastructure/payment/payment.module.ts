// // src/payment/payment.module.ts
// import { Module } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { PaypalProvider } from './providers/paypal.provider';
// import { StripeProvider } from './providers/stripe.provider';

// @Module({
//   providers: [
//     PaymentService,
//     {
//       provide: 'PAYMENT_PROVIDER',
//       useClass:
//         process.env.PAYMENT_PROVIDER === 'stripe'
//           ? StripeProvider
//           : PaypalProvider,
//     },
//   ],
//   exports: [PaymentService],
// })
// export class PaymentModule {}

// src/payment/payment.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { FlutterwavePaymentProvider } from './providers/flutterwave.provider';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/modules/vendor/order/order.module';
import { ConfigModule } from '@nestjs/config';
import { OrderCallbackHandlerService } from './callbacks/order-callback-handler.service';

@Module({
  imports: [forwardRef(() => OrderModule)],
  providers: [
    PaymentService,
    ConfigModule,
    {
      provide: 'ORDER_CALLBACK_HANDLER',
      useClass: OrderCallbackHandlerService,
    },
    // {
    //   provide: 'INVENTORY_CALLBACK_HANDLER',
    //   useClass: InventoryCallbackHandlerService,
    // },
    {
      provide: 'FLUTTERWAVE_PAYMENT_PROVIDER',
      useClass: FlutterwavePaymentProvider,
    },
  ],
  exports: [
    PaymentService,
    'FLUTTERWAVE_PAYMENT_PROVIDER',
    'ORDER_CALLBACK_HANDLER',
  ],

  controllers: [PaymentController],
})
export class PaymentModule { }
