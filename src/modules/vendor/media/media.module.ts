import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './models/media.model';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { MediaController } from './controllers';
import { MediaUploadService } from './services';

@Module({
  imports: [SequelizeModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, MediaUploadService],
  exports: [MediaService, MediaRepository, MediaUploadService],
})
export class MediaModule { }