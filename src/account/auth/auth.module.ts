import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { SessionModule } from '../session/session.module';
import { TokenStrategy } from './token.strategy';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [
    UserModule,
    VendorModule,
    SessionModule,
    PassportModule.register({ session: false }), // Disable sessions
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
