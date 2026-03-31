import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { AttributeModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([AttributeModel])],
  providers: [AttributeService],
  controllers: [AttributeController],
})
export class AttributeModule { }
