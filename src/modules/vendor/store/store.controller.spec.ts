import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';

describe('storeController', () => {
  let controller: storeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [storeController],
    }).compile();

    controller = module.get<storeController>(storeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
