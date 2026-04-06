import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { VendorService } from '../vendor/onboarding/vendor.service';
import { SessionService } from './session/session.service';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { CustomerService } from '../user/customer/customer.service';
import { Sequelize } from 'sequelize-typescript';
import { UserRepository } from 'src/infrastructure/database/repositories';
import { CustomerRepository } from 'src/infrastructure/database/repositories/customer.repository';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'your-jwt-secret';

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly jwtService: JwtService,
    // private readonly vendorService: VendorService,
    private readonly _customerRepository: CustomerRepository,
    private readonly sessionService: SessionService,
    private readonly _sequelize: Sequelize,
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
    const user = await this._userRepository.findOne({ where: { email } });
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
    const transaction = await this._sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await this._userRepository.createWithTransaction(
        {
          ...user,
          password_hash: hashedPassword,
        },
        transaction,
      );

      console.log('newUser', newUser, newUser.id);

      // Verify user was created successfully
      if (!newUser || !newUser.id) {
        throw new Error('User creation failed - no ID returned');
      }

      const newCustomer = await this._customerRepository.createWithTransaction(
        {
          user_id: newUser.id,
          // You can also pass other data from newUser if needed
          status: 'active',
        },
        transaction,
      );

      await transaction.commit();

      // Return combined data if needed
      return {
        user: newUser,
        customer: newCustomer,
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed:', error);
      throw new Error(`Database transaction failed: ${error.message}`);
    }
  }
}
