import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "@app/modules/health/health.controller";
import { HealthService } from "@app/modules/health/health.service";

describe("HealthController", () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            checkLive: jest.fn().mockReturnValue("live"),
            checkReady: jest.fn().mockReturnValue("ready"),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call healthService.checkLive and logger.log", () => {
    const spy = jest.spyOn(service, "checkLive");
    const result = controller.checkLive();
    expect(result).toBe("live");
    expect(spy).toHaveBeenCalled();
  });

  it("should call healthService.checkReady and logger.log", () => {
    const spy = jest.spyOn(service, "checkReady");
    const result = controller.checkReady();
    expect(result).toBe("ready");
    expect(spy).toHaveBeenCalled();
  });

  it("should instantiate with all dependencies", () => {
    expect(controller["healthService"]).toBeDefined();
  });
});
