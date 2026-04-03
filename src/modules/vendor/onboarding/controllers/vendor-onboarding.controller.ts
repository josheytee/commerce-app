import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VendorService } from '../vendor.service';
import { CreateVendorDto } from '../dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { AuthenticatedRequest } from 'src/modules/auth/interfaces';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { VendorModel } from 'src/infrastructure';

@ApiBearerAuth()
@ApiTags('Vendor - Onboarding')
@Controller('vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class VendorOnboardingController {
  constructor(private readonly vendorService: VendorService) { }

  @Post()
  @ApiSuccessResponse(VendorModel)
  create(
    @Body() data: CreateVendorDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<VendorModel> {
    return this.vendorService.create({ ...data, ...{ user_id: req.user.id } });
  }
}
