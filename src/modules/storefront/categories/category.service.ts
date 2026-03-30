import { Injectable } from '@nestjs/common';
import { Category } from './category.model';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) { }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
  async findById(id: number): Promise<Category> {
    return this.categoryRepository.findById(id);
  }
}
