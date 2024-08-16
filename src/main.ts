import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from './winston-logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // Ignore HMR and SSE routes
  app.use((req, res, next) => {
    if (req.url.includes('__webpack_hmr') || req.url.includes('_loading/sse')) {
      return res.status(204).send();
    }
    next();
  });

  await app.listen(3000);
}
bootstrap();
