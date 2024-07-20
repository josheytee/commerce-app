import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AccountModule } from './account/account.module';
import { StoreModule } from './store/store.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CatsModule, AccountModule, StoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
