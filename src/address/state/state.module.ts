import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { State } from './state.model';
import { StateService } from './state.service';
import { StateController } from './state.controller';

@Module({
  imports: [SequelizeModule.forFeature([State])],
  providers: [StateService],
  controllers: [StateController],
})
export class StateModule {}
