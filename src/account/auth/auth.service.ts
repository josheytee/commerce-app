// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SessionService } from '../session/session.service';
import { User } from '../user/interfaces/user.interface';
import { VendorService } from '../vendor/vendor.service';
import { UserLoginDto } from './dto';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'your-jwt-secret';

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly vendorService: VendorService,
    private readonly sessionService: SessionService,
  ) { }

  async validateToken(token: string): Promise<any> {
    const session = await this.sessionService.findSessionByToken(token);

    // todo: use secret instead
    // const vendor = await this.vendorService.findByPublicKey(token);

    // If no session is found, throw an UnauthorizedException
    if (!session) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // if (vendor) {
    //   return vendor.user;
    // }

    // Check if the token is expired
    const isExpired = session.expires_at <= new Date();
    if (isExpired) {
      // Optionally, you could delete the expired session here
      await this.sessionService.removeByToken(token);

      // Throw an UnauthorizedException if the token is expired
      throw new UnauthorizedException('Token has expired');
    }

    // Return the session data if the token is valid and not expired
    return session.user;
  }

  async createToken(user: User): Promise<string> {
    const token = this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Set expiration time (1 hour later)

    await this.sessionService.create({
      user_id: user.id,
      token,
      expires_at: expiresAt, //new Date(Date.now() + 3600 * 1000),
    });
    return token;
  }

  async logout(token: string): Promise<void> {
    await this.sessionService.removeByToken(token);
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      // Validate input parameters
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Find user by username
      const user = await this.usersService.findOne({ username });
      console.log('user', username, user)
      // Check if user exists
      if (!user) {
        return null; // User not found - return null for authentication failure
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return null; // Invalid password - return null for authentication failure
      }

      // Check if user is active (optional - depends on your requirements)
      // if (user.is_active === false) {
      //   throw new Error('User account is inactive');
      // }

      // Return user data without sensitive information
      const { password_hash, ...result } = user.dataValues;
      return result;
    } catch (error) {
      // Log the error for debugging (you can inject a logger service)
      console.error('Error in validateUser:', error.message);

      // Re-throw specific errors that should be handled by the caller
      if (
        error.message.includes('required') ||
        error.message.includes('inactive')
      ) {
        throw error;
      }

      // For any other errors, return null (authentication failed)
      return null;
    }
  }

  async login(user: User): Promise<{ access_token: string }> {
    // Create the JWT payload
    const token = await this.createToken(user);

    // find active sessions and expires them
    this.sessionService.deleteExpiredSessions(user.id);

    // Return the access token
    return {
      access_token: token,
    };
  }
  async register(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersService.create({
      ...user,
      password_hash: hashedPassword,
    });
    return newUser;
  }
}
