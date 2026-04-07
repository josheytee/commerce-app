import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { CartService } from './cart.service';

@ApiTags('Storefront - Cart')
@ApiBearerAuth()
@UseGuards(TokenAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) { }

  @Post()
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: number, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(id, dto.quantity);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: number) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
