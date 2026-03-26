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
import { AuthenticatedUser } from 'src/account/auth/interfaces';
import { GetUser } from 'src/account/auth/decorators/get-user.decorator';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @Post()
  create(
    @Body() createRatingDto: CreateRatingDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.ratingService.create(createRatingDto, user.id);
  }

  @Get()
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.ratingService.update(+id, updateRatingDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.ratingService.remove(+id, user.id);
  }
}
