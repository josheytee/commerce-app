// src/controllers/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne({ id });
  }

  @Post()
  async create(@Body() user: Partial<CreateUserDto>): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>) {
    const updatedUser = await this.userService.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found or no changes made');
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
