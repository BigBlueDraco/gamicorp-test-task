import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cacheManager from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { faker } from '@faker-js/faker';

(async function redisCacher() {
  const redisCache = cacheManager.caching({
    store: redisStore,
    max: 1000,
    host: 'localhost',
    port: 6379,
  });
  const redisClient = redisCache.store.getClient();
  const keys: [any] = await redisCache.keys();
  redisCache.reset();
  if (keys.length >= 1000) return;
  redisClient.on('error', (error) => {
    console.log(error);
  });
  for (let i = 0; i < 1000; i++) {
    redisCache.set(`${i}`, `${faker.internet.userName()}`);
  }
})();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
