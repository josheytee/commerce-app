import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from './winston-logger.config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  // Set the global prefix
  app.setGlobalPrefix('api');

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // Versioning via URI (/v1, /v2, etc.)
  });

  // Ignore HMR and SSE routes
  app.use((req, res, next) => {
    if (req.url.includes('__webpack_hmr') || req.url.includes('_loading/sse')) {
      return res.status(204).send();
    }
    next();
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
