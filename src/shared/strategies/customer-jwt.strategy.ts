// src/shared/strategies/customer-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerRepository } from 'src/infrastructure/database/repositories';
import { jwtConstants } from 'src/modules/auth/constants';

export interface CustomerJwtPayload {
    sub: number;       // user ID
    email: string;
    type: 'customer' | 'vendor' | 'admin';
    customerId?: number;
}

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly customerRepository: CustomerRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: CustomerJwtPayload) {
        console.log('payload', payload)
        // Validate token type
        // if (payload.type !== 'customer') {
        //     throw new UnauthorizedException('Invalid token type for customer access');
        // }

        // Fetch customer from DB
        const customer = await this.customerRepository.findByUserId(payload.sub);

        if (!customer) {
            throw new UnauthorizedException('Customer not found');
        }

        // Attach to req.user - this is what your guard checks
        return {
            id: payload.sub,
            email: payload.email,
            type: payload.type,
            customer: {
                id: customer.id,
                user_id: payload.sub,
                // Add other customer fields as needed
            },
        };
    }
}
