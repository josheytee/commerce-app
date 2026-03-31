import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { StateModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([StateModel])],
  providers: [StateService],
  controllers: [StateController],
})
export class StateModule { }
