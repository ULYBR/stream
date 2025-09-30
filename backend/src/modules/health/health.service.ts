import { Injectable } from "@nestjs/common";
@Injectable()
export class HealthService {
  checkLive(): string {
    return "I am alive!";
  }

  checkReady(): string {
    return "I am ready!";
  }
}
