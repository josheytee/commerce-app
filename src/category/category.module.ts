import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryController } from './category.controller';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule { }
