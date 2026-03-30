import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticatedUser } from 'src/modules/auth/interfaces';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { Review } from './model/review.model';
import { ApiSuccessResponse } from 'src/api.response';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @ApiSuccessResponse(Review)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @Get()
  @ApiSuccessResponse(Review)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(Review)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Review)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  @ApiSuccessResponse(Review)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
