
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Body,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';

@Controller('uploads')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    // Single file upload
    @Post('single')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(
        @UploadedFile() file: Express.Multer.File,
        @Body('entityType') entityType: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return this.fileUploadService.uploadFile(file, entityType);
    }

    // Multiple files upload
    @Post('multiple')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('entityType') entityType: string,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        return this.fileUploadService.uploadMultipleFiles(files, entityType);
    }
}