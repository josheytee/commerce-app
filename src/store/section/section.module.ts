import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Section } from './section.model';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

@Module({
  imports: [SequelizeModule.forFeature([Section])],
  providers: [SectionService],
  controllers: [SectionController],
})
export class SectionModule {}
