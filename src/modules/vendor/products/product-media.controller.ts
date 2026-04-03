// product-media.controller.ts
import {
    Controller,
    Post,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
    Req,
    UploadedFiles,
    ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiTags,
    ApiConsumes,
    ApiBody,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { MediaTypeEnum } from 'src/shared';
import { ProductService } from './services';
import { MediaUploadService } from '../media/services';

@ApiBearerAuth()
@ApiTags('Vendor - Products Media')
@Controller('/products')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class ProductMediaController {
    constructor(
        private productService: ProductService,
        private mediaUploadService: MediaUploadService,
    ) { }

    // @Post(':id/gallery_images')
    // @ApiOperation({ summary: 'Upload Product gallery image' })
    // @ApiParam({ name: 'id', description: 'ProductModel ID', type: 'number' })
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             logo: {
    //                 type: 'string',
    //                 format: 'binary',
    //                 description: 'Gallery image file (jpg, png, etc.)',
    //             },
    //         },
    //     },
    // })
    // @UseInterceptors(FileInterceptor('gallery'))
    // async uploadLogo(
    //     @Param('id') id: number,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Req() req,
    // ) {
    //     if (!file) {
    //         throw new BadRequestException('No file uploaded');
    //     }

    //     const product = await this.productService.findOne(+id);
    //     if (!product) {
    //         throw new BadRequestException('ProductModel not found');
    //     }

    //     const media = await this.mediaUploadService.uploadAndSave(
    //         file,
    //         'product',
    //         +id,
    //         MediaTypeEnum.PRODUCT_GALLERY,
    //         req.user.id,
    //     );

    //     return media;
    // }

    @Post(':id/featured')
    @ApiOperation({ summary: 'Upload product featured image' })
    @ApiParam({ name: 'id', description: 'Product ID', type: 'number' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                featured: {
                    type: 'string',
                    format: 'binary',
                    description: 'Featured image file (jpg, png, etc.)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('featured'))
    async uploadCover(
        @Param('id', ParseIntPipe) id: string,
        // @Param('vendorId', ParseIntPipe) vendorId: number,

        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const media = await this.mediaUploadService.uploadAndSave(
            file,
            'product',
            +id,
            MediaTypeEnum.PRODUCT_IMAGE,
            req.user.id,
        );

        return {
            media,
        };
    }

    @Post(':id/gallery')
    @ApiOperation({ summary: 'Upload multiple gallery images' })
    @ApiParam({ name: 'id', description: 'Product ID', type: 'number' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Gallery image files (up to 10)',
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('images', 10))
    async uploadGallery(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const uploadPromises = files.map((file) =>
            this.mediaUploadService.uploadAndSave(
                file,
                'product',
                +id,
                MediaTypeEnum.PRODUCT_GALLERY,
                req.user.id,
            ),
        );

        const media = await Promise.all(uploadPromises);

        return {
            success: true,
            data: media,
            message: `${media.length} images uploaded successfully`,
        };
    }
}
