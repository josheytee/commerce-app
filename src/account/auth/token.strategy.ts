import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { AuthService } from './auth.service';

class CustomStrategy extends Strategy {
  name: string;

  constructor(private authService: AuthService) {
    super();
    this.name = 'token';
  }

  async authenticate(req: Request) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return this.fail(new UnauthorizedException('Token not found'), 401);
      }

      const user = await this.authService.validateToken(token);
      if (!user) {
        return this.fail(new UnauthorizedException('Invalid token'), 401);
      }

      // Attach the user to the request object
      (req as any).user = user;

      // Indicate a successful authentication
      return this.success(user);
    } catch (err) {
      return this.error(err);
    }
  }

  // Implement fail method
  fail(error: Error, status: number) {
    return this.error(error);
  }

  // Implement success method
  success(session: any) {
    return this.pass();
  }

  // Implement error method
  error(err: Error) {
    // Handle error, but without using `emit`
    console.log('Error during authentication:', err.message);
    return super.fail(err);
  }

  // Implement pass method
  pass() {
    // Indicate the strategy passed without an error
    console.log('Authentication passed');
  }
}

@Injectable()
export class TokenStrategy extends PassportStrategy(CustomStrategy, 'token') {
  constructor(authService: AuthService) {
    super(authService);
  }

  async validate(payload: any) {
    return { user_id: payload.sub, username: payload.username };
  }
}
