import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { Attribute } from './models/attribute.model';

@Module({
  imports: [SequelizeModule.forFeature([Attribute])],
  providers: [AttributeService],
  controllers: [AttributeController],
})
export class AttributeModule {}
