import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    constructor(
        private readonly maxSize: number = 5 * 1024 * 1024,
        private readonly allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ) { }

    transform(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed: ${this.allowedTypes.join(', ')}`,
            );
        }

        if (file.size > this.maxSize) {
            throw new BadRequestException(
                `File too large. Max size: ${this.maxSize / (1024 * 1024)}MB`,
            );
        }

        return file;
    }
}