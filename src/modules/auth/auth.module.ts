import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { TokenStrategy } from './token.strategy';
import { UserModule } from '../user/user.module';
import { SessionModule } from './session/session.module';
import { CustomerModule } from '../user/customer/customer.module';
import { CustomerJwtStrategy } from 'src/shared/strategies';

@Module({
  imports: [
    UserModule,
    SessionModule,
    CustomerModule,
    PassportModule.register({ session: false }), // Disable sessions
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    TokenStrategy,
    CustomerJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule { }
