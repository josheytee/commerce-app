import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { VendorService } from 'src/account/vendor/vendor.service';

@Injectable()
export class WebhookSecurityService {
  constructor(private readonly vendorService: VendorService) { }

  async generateSignature(payload: any, secret: string): Promise<string> {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  async verifySignature(
    payload: any,
    receivedSignature: string,
    vendorId: number,
  ): Promise<boolean> {
    const vendor = await this.vendorService.findOne(vendorId); // Fetch vendor details
    if (!vendor) {
      throw new UnauthorizedException('Vendor not found');
    }
    const expectedSignature = await this.generateSignature(
      payload,
      'vendor.api_key', // change to secret in future
    );
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature),
    );
  }
}
