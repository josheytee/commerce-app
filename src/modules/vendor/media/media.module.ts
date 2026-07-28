import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaService } from './media.service';
import { MediaController } from './controllers';
import { MediaUploadService } from './services';
import { MediaModel } from 'src/infrastructure';
import { MediaRepository } from 'src/infrastructure/database/repositories';

@Module({
  imports: [SequelizeModule.forFeature([MediaModel])],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, MediaUploadService],
  exports: [MediaService, MediaRepository, MediaUploadService],
})
export class MediaModule { }