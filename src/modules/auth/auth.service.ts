import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user/user.service';
import { VendorService } from '../vendor/onboarding/vendor.service';
import { SessionService } from './session/session.service';
import { User } from '../user/user/interfaces/user.interface';

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
      email: user.email,
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

  async validateUser(email: string, password: string): Promise<any> {
    // Find user by email instead of username
    const user = await this.usersService.findOne({ email });
    if (user && (await this.comparePassword(password, user.password_hash))) {
      const { password_hash, ...result } = user.dataValues;
      return result;
    }
    return null;
  }

  async comparePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
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
