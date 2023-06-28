import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from 'src/auth/guards/JwtGuard';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @UseGuards(JwtAuthGuard)
  @Get('random')
  getRandom() {
    return this.dataService.getRandomData();
  }
}
