import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerModel } from 'src/infrastructure';
import { ApiTags } from '@nestjs/swagger';

@Controller('customers')
@ApiTags('Customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  create(@Body() data: Partial<CustomerModel>): Promise<CustomerModel> {
    return this.customerService.create(data);
  }

  @Get()
  findAll(): Promise<CustomerModel[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CustomerModel> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<CustomerModel>,
  ): Promise<CustomerModel> {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.customerService.remove(id);
  }
}
