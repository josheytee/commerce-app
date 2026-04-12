import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './categories/category.module';
import { ProductsModule } from './products/products.module';

@Module({
    imports: [CartModule, CategoryModule, ProductsModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class StorefrontModule { }
