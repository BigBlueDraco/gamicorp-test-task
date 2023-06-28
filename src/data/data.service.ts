import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class DataService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}
  async getRandomData() {
    const result: string[] = [];
    for (let i = 0; i < 10; i++) {
      Math.floor(Math.random() * 1000) + 1;
      const item: string = await this.cacheService.get(`${i}`);
      result.push(item);
    }
    return result;
  }
}
