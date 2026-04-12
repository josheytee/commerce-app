import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { StoreFrontProductController } from './store-front-product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from 'src/infrastructure';
import { ProductRepository } from 'src/infrastructure/database/repositories';

@Module({
    imports: [SequelizeModule.forFeature([ProductModel])],
    controllers: [StoreFrontProductController],
    providers: [ProductRepository, ProductService],
    exports: [ProductService],
})
export class ProductsModule { }
