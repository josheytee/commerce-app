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
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { VendorService } from './onboarding/vendor.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
} from 'src/modules/auth/interfaces';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { VendorModel } from 'src/infrastructure';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { VendorFilterDto, VendorListResponseDto } from './onboarding/dto';

@ApiBearerAuth()
@ApiTags('Vendor Management')
@Controller('vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  // @Get()
  // @Permissions('vendor:view')
  // @ApiSuccessResponse(VendorModel)
  // findAll(@Req() req: AuthenticatedRequest): Promise<VendorModel[]> {
  //   const user_id = req.user.id; // Extract the user ID from the request
  //   return this.vendorService.findVendorsByUserId(user_id);
  // }

  @Get()
  @Permissions('vendor:view')
  @ApiOperation({
    summary: 'Get vendors with filters',
    description:
      'Retrieve a paginated list of vendors with advanced filtering options',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendors retrieved successfully',
    type: VendorListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Public()
  async findVendorsWithFilters(
    @Query(new ValidationPipe({ transform: true })) filters: VendorFilterDto,
  ): Promise<VendorListResponseDto> {
    return this.vendorService.findVendorsWithFilters(filters);
  }

  @Get(':id')
  @Public()
  @ApiSuccessResponse(VendorModel)
  findOne(@Param('id') id: number): Promise<VendorModel> {
    return this.vendorService.getVendor(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(VendorModel)
  update(
    @Param('id') id: number,
    @Body() data: Partial<VendorModel>,
  ): Promise<VendorModel> {
    return this.vendorService.update(id, data);
  }

  @Patch(':id/set-as-default')
  @ApiSuccessResponse(VendorModel)
  setAsDefault(
    @Param('id') id: number,
    @GetUser() user: AuthenticatedUser,
  ): Promise<VendorModel> {
    return this.vendorService.setAsDefault(user.id, id);
  }

  @Delete(':id')
  @ApiSuccessResponse(VendorModel)
  remove(@Param('id') id: number): Promise<void> {
    return this.vendorService.delete(id);
  }
}
