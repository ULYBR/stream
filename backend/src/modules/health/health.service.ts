import { Injectable } from "@nestjs/common";
import { EventPublisherService } from "@app/providers/event-publisher.service";
import { SystemEvent } from "@app/types/events.types";

@Injectable()
export class HealthService {
  constructor(private readonly eventPublisher: EventPublisherService) { }

  async checkLive(): Promise<string> {
    const event: SystemEvent = {
      id: `health-${Date.now()}`,
      type: "Health Check",
      source: "streamhub.system",
      timestamp: new Date().toISOString(),
      data: {
        component: "health-live",
        status: "healthy",
      },
    };

    await this.eventPublisher.publishSystemEvent(event);
    return "I am alive!";
  }

  async checkReady(): Promise<string> {
    const event: SystemEvent = {
      id: `health-${Date.now()}`,
      type: "Health Check",
      source: "streamhub.system",
      timestamp: new Date().toISOString(),
      data: {
        component: "health-ready",
        status: "healthy",
      },
    };

    await this.eventPublisher.publishSystemEvent(event);
    return "I am ready!";
  }
}
