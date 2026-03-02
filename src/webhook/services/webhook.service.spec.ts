import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// Step 5: Test Sending and Receiving
// Outgoing Webhook Test
// Simulate sending webhooks to a vendor:

// typescript
// Copy code
// const webhookPayload = { orderId: 123, status: 'shipped' };
// const vendorSecret = 'vendor-shared-secret';
// await webhooksService.sendWebhook('https://vendor-api.com/webhooks', webhookPayload, vendorSecret);
// Incoming Webhook Test
// Simulate a vendor sending a webhook to your app:

// bash
// Copy code
// curl -X POST http://localhost:3000/api/webhooks \
//   -H "x-signature: <calculated-signature>" \
//   -H "x-vendor-id: <vendor-id>" \
//   -H "Content-Type: application/json" \
//   -d '{"event": "order.created", "data": {"id": 123}}'
