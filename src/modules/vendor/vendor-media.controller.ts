// vendor-media.controller.ts
import {
    Controller,
    Post,
    Param,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    BadRequestException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaUploadService } from 'src/modules/vendor/media/services/media-upload.service';
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
import { VendorService } from './onboarding/vendor.service';
import { MediaTypeEnum } from 'src/shared';

@ApiBearerAuth()
@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class VendorMediaController {
    constructor(
        private vendorService: VendorService,
        private mediaUploadService: MediaUploadService,
    ) { }

    @Post(':id/logo')
    @ApiOperation({ summary: 'Upload vendor logo' })
    @ApiParam({ name: 'id', description: 'VendorModel ID', type: 'number' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Logo image file (jpg, png, etc.)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('logo'))
    async uploadLogo(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const vendor = await this.vendorService.findById(+id);
        if (!vendor) {
            throw new BadRequestException('VendorModel not found');
        }

        const media = await this.mediaUploadService.uploadAndSave(
            file,
            'vendor',
            +id,
            MediaTypeEnum.VENDOR_LOGO,
            req.user.id,
        );

        return media;
    }

    @Post(':id/cover')
    @ApiOperation({ summary: 'Upload vendor cover image' })
    @ApiParam({ name: 'id', description: 'VendorModel ID', type: 'number' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cover: {
                    type: 'string',
                    format: 'binary',
                    description: 'Cover image file (jpg, png, etc.)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('cover'))
    async uploadCover(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const media = await this.mediaUploadService.uploadAndSave(
            file,
            'vendor',
            +id,
            MediaTypeEnum.VENDOR_COVER,
            req.user.id,
        );

        return {
            media,
        };
    }

    // @Post(':id/gallery')
    // @ApiOperation({ summary: 'Upload multiple gallery images' })
    // @ApiParam({ name: 'id', description: 'VendorModel ID', type: 'number' })
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             images: {
    //                 type: 'array',
    //                 items: {
    //                     type: 'string',
    //                     format: 'binary',
    //                 },
    //                 description: 'Gallery image files (up to 10)',
    //             },
    //         },
    //     },
    // })
    // @UseInterceptors(FilesInterceptor('images', 10))
    // async uploadGallery(
    //     @Param('id') id: string,
    //     @UploadedFiles() files: Express.Multer.File[],
    //     @Req() req,
    // ) {
    //     if (!files || files.length === 0) {
    //         throw new BadRequestException('No files uploaded');
    //     }

    //     const uploadPromises = files.map((file) =>
    //         this.mediaUploadService.uploadAndSave(
    //             file,
    //             'vendor',
    //             +id,
    //             MediaTypeEnum.VENDOR_GALLERY,
    //             req.user.id,
    //         ),
    //     );

    //     const media = await Promise.all(uploadPromises);

    //     return {
    //         success: true,
    //         data: media,
    //         message: `${media.length} images uploaded successfully`,
    //     };
    // }
}
