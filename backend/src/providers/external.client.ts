import { Injectable } from "@nestjs/common";

@Injectable()
export class ExternalClient {
  constructor() {}

  async receiveMessage(): Promise<Record<string, unknown> | null> {
    return null;
  }
}
