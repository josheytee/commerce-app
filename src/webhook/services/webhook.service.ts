// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { WebhookSecurityService } from './webhook-security.service';
// import * as fetch from 'node-fetch'; // Use native fetch in modern Node.js

// @Injectable()
// export class WebhookService {
//   constructor(private readonly securityService: WebhookSecurityService) {}

//   async sendWebhook(url: string, payload: any, secret: string) {
//     const signature = this.securityService.generateSignature(payload, secret);
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-signature': signature,
//         'x-webhook-version': '1.0',
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to send webhook: ${response.statusText}`);
//     }

//     return response.json();
//   }

//   async validateIncomingWebhook(
//     payload: any,
//     signature: string,
//     vendorId: number,
//   ) {
//     const isValid = this.securityService.verifySignature(
//       payload,
//       signature,
//       vendorId,
//     );

//     if (!isValid) {
//       throw new UnauthorizedException('Invalid webhook signature');
//     }
//   }
// }
