import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from 'src/infrastructure';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryModel> {
    constructor(
        @InjectModel(CategoryModel)
        private categoryModel: typeof CategoryModel,
    ) {
        super(categoryModel);
    }
}
