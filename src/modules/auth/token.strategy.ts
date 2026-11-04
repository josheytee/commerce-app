// Extend the Strategy class properly
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { AuthService } from './auth.service';

export class CustomTokenStrategy extends Strategy {
  name = 'token';
  private readonly logger = new Logger(CustomTokenStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req: Request, options?: any) {
    this.logger.debug('🔐 CustomTokenStrategy.authenticate() started');

    // 🟢 Cast 'this' to an any context to bypass the missing Passport declaration types
    const self = this as any;

    try {
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        this.logger.debug('❌ No token found in request');
        return self.fail('Authorization token not found', 401);
      }

      this.logger.debug('🔄 Validating token against session database...');
      const user = await this.authService.validateToken(token);

      if (!user) {
        this.logger.debug('❌ Invalid token - no active session found');
        return self.fail('Invalid or expired token', 401);
      }

      if (user.isActive === false) {
        this.logger.debug('❌ User account is inactive');
        return self.fail('User account is inactive', 403);
      }

      this.logger.debug(`✅ Session auth successful for user: ${user.id}`);

      // Passport will capture this and bind the user to req.user automatically
      return self.success(user);
    } catch (error: any) {
      this.logger.error(
        `❌ Authentication error: ${error.message}`,
        error.stack,
      );
      return self.error(error);
    }
  }

  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }
}

@Injectable()
export class TokenStrategy extends PassportStrategy(
  CustomTokenStrategy,
  'token',
) {
  constructor(authService: AuthService) {
    super(authService);
  }
}
