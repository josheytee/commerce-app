import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { AuthService } from './auth.service';

// Extend the Strategy class properly
export class CustomTokenStrategy extends Strategy {
  name = 'token';
  private readonly logger = new Logger(CustomTokenStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  /**
   * The main authentication method - must call success(), fail(), or error()
   */
  async authenticate(req: Request, options?: any) {
    this.logger.debug('🔐 CustomTokenStrategy.authenticate() started');

    try {
      // 1. Extract token from request
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        this.logger.debug('❌ No token found in request');
        return this.fail('Authorization token not found', 401);
      }

      // 2. Validate token with auth service
      this.logger.debug('🔄 Validating token...');
      const user = await this.authService.validateToken(token);

      if (!user) {
        this.logger.debug('❌ Invalid token - no user returned');
        return this.fail('Invalid or expired token', 401);
      }

      // 3. Check if user is active (optional)
      if (user.isActive === false) {
        this.logger.debug('❌ User account is inactive');
        return this.fail('User account is inactive', 403);
      }

      // 4. SUCCESS! This is critical - must call success()
      this.logger.debug(
        `✅ Authentication successful for user: ${user.id || user.username}`,
      );

      // StoreModel user in request object
      (req as any).user = user;

      // Call success with the user object
      return this.success(user);
    } catch (error) {
      // 5. ERROR handling - must call error()
      this.logger.error(
        `❌ Authentication error: ${error.message}`,
        error.stack,
      );
      return this.error(error);
    }
  }

  /**
   * Extract Bearer token from Authorization header
   */
  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      return null;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  /**
   * Override success method - calls this.pass() which completes the authentication
   */
  success(user: any) {
    this.logger.debug('✅ CustomTokenStrategy.success() called');
    this.pass(); // This passes control to the next step (the guard)
    return user;
  }

  pass() {
    // Indicate the strategy passed without an error
    console.log('Authentication passed');
  }

  /**
   * Override fail method - calls this.fail() with challenge and status
   */
  fail(challenge: string | Error, status?: number) {
    this.logger.debug(`❌ CustomTokenStrategy.fail() called: ${challenge}`);

    if (challenge instanceof Error) {
      return super.fail(challenge.message, status);
    }
    return super.fail(challenge, status);
  }

  /**
   * Override error method - calls this.error() with the error
   */
  error(err: Error) {
    this.logger.error(`❌ CustomTokenStrategy.error() called: ${err.message}`);
    return super.error(err);
  }
}

/**
 * NestJS wrapper for the custom strategy
 */
@Injectable()
export class TokenStrategy extends PassportStrategy(
  CustomTokenStrategy,
  'token',
) {
  constructor(authService: AuthService) {
    super(authService);
  }
}
