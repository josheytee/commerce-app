// import {
//   Controller,
//   Post,
//   Headers,
//   Body,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { WebhookService } from './services/webhook.service';

// @Controller('webhooks')
// export class WebhookController {
//   constructor(private readonly webhookService: WebhookService) {}

//   @Post()
//   @HttpCode(HttpStatus.OK)
//   async receiveWebhook(
//     @Headers('x-signature') signature: string,
//     @Headers('x-vendor-id') vendorId: number,
//     @Body() payload: any,
//   ) {
//     await this.webhookService.validateIncomingWebhook(
//       payload,
//       signature,
//       vendorId,
//     );
//     console.log('Webhook processed for vendor:', vendorId);
//     return { status: 'success' };
//   }
// }
