import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { Category } from './category.model';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
    constructor(
        @InjectModel(Category)
        private categoryModel: typeof Category,
    ) {
        super(categoryModel);
    }
}
