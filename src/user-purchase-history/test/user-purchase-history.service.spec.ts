import { Test, TestingModule } from '@nestjs/testing';
import { UserPurchaseHistoryService } from '../user-purchase-history.service';

describe('UserPurchaseHistoryService', () => {
  let service: UserPurchaseHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPurchaseHistoryService],
    }).compile();

    service = module.get<UserPurchaseHistoryService>(
      UserPurchaseHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
