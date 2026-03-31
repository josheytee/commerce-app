import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function bootstrap(app: INestApplication) {
    const configService = app.get(ConfigService);

    // Application setup
    const port = configService.get('app.port');
    const env = configService.get('app.env');

    console.log(`Application running in ${env} mode`);
    console.log(`Listening on port ${port}`);

    return { port, env };
}
