// media-upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { Media } from './models/media.model';
// import { MediaType } from './models/media-type.enum';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Media } from '../models/media.model';
import { MediaType } from '../models/media-type.enum';

@Injectable()
export class MediaUploadService {
    constructor(
        @InjectModel(Media)
        private mediaModel: typeof Media,
    ) { }

    async uploadAndSave(
        file: Express.Multer.File,
        entityType: string,
        entityId: number,
        mediaType: MediaType,
        userId: number,
    ): Promise<Media> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file
        this.validateFile(file);

        // Save file to disk/cloud
        const fileInfo = await this.saveFile(file, entityId, entityType);

        // Create media record in database
        const media = await this.mediaModel.create({
            url: fileInfo.url,
            key: fileInfo.key,
            thumbnail_url: fileInfo.thumbnailUrl,
            medium_url: fileInfo.mediumUrl,
            alt_text: file.originalname,
            title: file.originalname,
            type: mediaType,
            entity_type: entityType,
            entity_id: entityId,
            file_size: file.size,
            mime_type: file.mimetype,
            uploaded_by: userId,
            metadata: {
                originalName: file.originalname,
                encoding: file.encoding,
            },
        });

        return media;
    }

    private validateFile(file: Express.Multer.File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            );
        }

        if (file.size > maxSize) {
            throw new BadRequestException(
                `File too large. Max size is ${maxSize / (1024 * 1024)}MB`,
            );
        }
    }

    private async saveFile(
        file: Express.Multer.File,
        entityId: number,
        entityType: string,
    ): Promise<any> {
        // Generate unique filename
        const extension = file.originalname.split('.').pop();
        const filename = `${uuidv4()}.${extension}`;
        const uploadDir = path.join(
            process.cwd(),
            'uploads',
            entityType,
            String(entityId),
        );
        const filePath = path.join(uploadDir, filename);

        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        // Save file
        await fs.writeFile(filePath, file.buffer);

        // Generate URLs (you might want to use a CDN in production)
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return {
            url: `${baseUrl}/uploads/${entityType}/${filename}`,
            key: filename,
            thumbnailUrl: `${baseUrl}/uploads/${entityType}/thumb_${filename}`,
            mediumUrl: `${baseUrl}/uploads/${entityType}/med_${filename}`,
        };
    }
}
