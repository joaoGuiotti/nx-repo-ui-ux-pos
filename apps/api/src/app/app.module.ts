import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CfpController } from './cfp/cfp.controller';
import { CfpService } from './cfp/cfp.service';

@Module({
  imports: [],
  controllers: [AppController, CfpController],
  providers: [AppService, CfpService],
})
export class AppModule {}
