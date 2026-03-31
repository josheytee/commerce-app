import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryModel } from 'src/infrastructure';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) { }

  async findAll(): Promise<CategoryModel[]> {
    return this.categoryRepository.findAll();
  }
  async findById(id: number): Promise<CategoryModel> {
    return this.categoryRepository.findById(id);
  }
}
