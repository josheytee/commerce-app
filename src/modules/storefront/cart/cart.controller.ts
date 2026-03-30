import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Cart } from './models/cart.model';
import { ApiSuccessResponse } from 'src/api.response';

@ApiTags('Storefront - Cart')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  @ApiSuccessResponse(Cart)
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiSuccessResponse(Cart)
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(Cart)
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Cart)
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiSuccessResponse(Cart)
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
