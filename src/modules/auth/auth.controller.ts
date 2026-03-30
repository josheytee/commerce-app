import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { GetUser } from './decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserLoginDto } from './dto/requests';
import { TokenAuthGuard } from './token-auth.guard';
import { AuthenticatedUser, AuthenticatedRequest } from './interfaces';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: AuthenticatedRequest,
    @Body() body: UserLoginDto,
  ) {
    // Extract the userId from the request (e.g., after user authentication)
    return this.authService.login(req.user);
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
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@GetUser() user: AuthenticatedUser) {
    return user;
  }
}
