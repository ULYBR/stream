import { HealthController } from "@app/modules/health/health.controller";
import { HealthService } from "@app/modules/health/health.service";
import { EventPublisherService } from "@app/providers/event-publisher.service";
import { SqsClient } from "@app/providers/sqs.client";
import { SqsUtil } from "@app/utils/sqs.util";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, EventPublisherService, SqsClient, SqsUtil],
})
export class HealthModule { }
