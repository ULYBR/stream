import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EnvironmentVariables } from "@app/config/env.config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

@Injectable()
export class DynamoClient {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}
  createDynamoInstance = () =>
    new DynamoDBClient({
      endpoint: this.configService.get<string>("dynamoURI"),
      region: this.configService.get<string>("dynamoRegion"),
    });
}
