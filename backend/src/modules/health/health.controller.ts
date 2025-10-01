import { HealthService } from "@app/modules/health/health.service";

import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get("status")
  async checkLive(): Promise<string> {
    return await this.healthService.checkLive();
  }

  @Get("readiness")
  async checkReady(): Promise<string> {
    return await this.healthService.checkReady();
  }
}
