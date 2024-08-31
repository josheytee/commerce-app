import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { TokenAuthGuard } from './token-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthenticatedRequest) {
    // Extract the userId from the request (e.g., after user authentication)
    // console;
    const userId = req.user.id;

    // console.log(req, userId, 'user id');

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Call the login method with the required userId
    return this.authService.login(userId);
    // return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: any) {
    if (
      !body.username ||
      !body.password ||
      !body.email ||
      !body.first_name ||
      !body.last_name ||
      !body.gender ||
      !body.phone_number
    ) {
      throw new BadRequestException('Missing required fields');
    }
    return this.authService.register(body);
  }

  @UseGuards(TokenAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
