// import { Injectable } from '@nestjs/common';
// import { RedisService } from 'nestjs-redis';

// @Injectable()
// export class SessionService {
//   constructor(private readonly redisService: RedisService) {}

//   async findSessionByToken(token: string): Promise<any> {
//     const client = this.redisService.getClient();
//     return client.get(token);
//   }

//   async createSession(
//     userId: number,
//     token: string,
//     expiresIn: number,
//   ): Promise<void> {
//     const client = this.redisService.getClient();
//     await client.set(token, userId, 'EX', expiresIn);
//   }
// }
