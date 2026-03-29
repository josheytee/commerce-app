// vendor-media.controller.ts
import {
    Controller,
    Post,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { MediaUploadService } from '../media/media-upload.service';
// import { MediaType } from '../media/models/media-type.enum';
// import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { VendorService } from '../vendor.service';
import { MediaUploadService } from 'src/media/services/media-upload.service';
import { MediaType } from 'src/media/models/media-type.enum';

@Controller('vendors')
export class VendorMediaController {
    constructor(
        private vendorService: VendorService,
        private mediaUploadService: MediaUploadService,
    ) { }

    @Post(':id/logo')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('logo'))
    async uploadLogo(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Verify vendor exists
        const vendor = await this.vendorService.findById(+id);
        if (!vendor) {
            throw new BadRequestException('Vendor not found');
        }

        const media = await this.mediaUploadService.uploadAndSave(
            file,
            'vendor',
            +id,
            MediaType.VENDOR_LOGO,
            req.user.id,
        );

        return {
            success: true,
            data: media,
            message: 'Logo uploaded successfully',
        };
    }


    @Post(':id/cover')
    @UseGuards(AuthGuard('jwt'))
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
            MediaType.VENDOR_COVER,
            req.user.id,
        );

        return {
            success: true,
            data: media,
            message: 'Cover image uploaded successfully',
        };
    }

    @Post(':id/gallery')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('images', { limits: { files: 10 } }))
    async uploadGallery(
        @Param('id') id: string,
        @UploadedFile() files: Express.Multer.File[],
        @Req() req,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const uploadPromises = files.map(file =>
            this.mediaUploadService.uploadAndSave(
                file,
                'vendor',
                +id,
                MediaType.VENDOR_GALLERY,
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