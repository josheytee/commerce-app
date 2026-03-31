import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { ApiTags } from '@nestjs/swagger';
import { RatingModel } from 'src/infrastructure';

@Controller('rating')
@ApiTags('Ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @Post()
  @ApiSuccessResponse(RatingModel)
  create(
    @Body() createRatingDto: CreateRatingDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.ratingService.create(createRatingDto, user.id);
  }

  @Get()
  @ApiSuccessResponse(RatingModel)
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(RatingModel)
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  @ApiSuccessResponse(RatingModel)
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.ratingService.update(+id, updateRatingDto, user.id);
  }

  @Delete(':id')
  @ApiSuccessResponse(RatingModel)
  remove(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.ratingService.remove(+id, user.id);
  }
}
