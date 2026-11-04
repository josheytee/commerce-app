import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const requestId = randomUUID();

        req.requestId = requestId;
        res.setHeader('X-Request-Id', requestId);

        next();
    }
}