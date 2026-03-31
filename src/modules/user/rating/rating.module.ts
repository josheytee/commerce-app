import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { RatingModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([RatingModel])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule { }