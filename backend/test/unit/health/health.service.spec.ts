import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "@app/modules/health/health.service";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return live", () => {
    expect(service.checkLive()).toBeDefined();
  });

  it("should return ready", () => {
    expect(service.checkReady()).toBeDefined();
  });
});
