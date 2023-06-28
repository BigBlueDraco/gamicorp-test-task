import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { JwtStrategy } from 'src/auth/strategy/JwtStrategy';

@Module({
  controllers: [DataController],
  providers: [DataService, JwtStrategy],
  exports: [DataService],
})
export class DataModule {}
