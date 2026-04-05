import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DeliveryService } from '../services';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly inventoryService: DeliveryService) { }


}
