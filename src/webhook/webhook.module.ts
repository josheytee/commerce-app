import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './services/webhook.service';
import { WebhookSecurityService } from './services/webhook-security.service';
import { VendorModule } from 'src/account/vendor/vendor.module';

@Module({
  imports: [VendorModule],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookSecurityService],
  exports: [WebhookService, WebhookSecurityService],
})
export class WebhookModule { }
