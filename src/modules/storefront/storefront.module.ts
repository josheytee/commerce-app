import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from '../vendor/products/product.module';

@Module({
    imports: [CartModule, CategoryModule, ProductModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class StorefrontModule { }
