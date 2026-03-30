
import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileUploadService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    async uploadFile(file: Express.Multer.File, entityType: string): Promise<any> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only images are allowed');
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File too large. Max size is 5MB');
        }

        // Generate unique filename
        const extension = path.extname(file.originalname);
        const filename = `${uuidv4()}${extension}`;
        const filePath = path.join(this.uploadDir, entityType, filename);

        // Ensure directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Save file
        await fs.writeFile(filePath, file.buffer);

        // Return file info
        return {
            url: `/uploads/${entityType}/${filename}`,
            filename,
            size: file.size,
            mimetype: file.mimetype,
        };
    }

    async uploadMultipleFiles(files: Express.Multer.File[], entityType: string) {
        const uploadPromises = files.map(file => this.uploadFile(file, entityType));
        return Promise.all(uploadPromises);
    }
}