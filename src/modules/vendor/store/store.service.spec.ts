import { Test, TestingModule } from '@nestjs/testing';
import { storeService } from './store.service';

describe('storeService', () => {
  let service: storeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [storeService],
    }).compile();

    service = module.get<storeService>(storeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
