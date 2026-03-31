import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([ReviewModel])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule { }