import { HealthService } from "@app/modules/health/health.service";

import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get("status")
  checkLive(): string {
    return this.healthService.checkLive();
  }

  @Get("readiness")
  checkReady(): string {
    return this.healthService.checkReady();
  }
}
