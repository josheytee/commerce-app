import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
    type: process.env.STORAGE_TYPE || 'local',
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.STORAGE_REGION,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
}));
