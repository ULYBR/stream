import { HealthController } from "@app/modules/health/health.controller";
import { HealthService } from "@app/modules/health/health.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
