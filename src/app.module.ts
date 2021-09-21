import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Client } from './Client';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Client], 
})
export class AppModule {}
