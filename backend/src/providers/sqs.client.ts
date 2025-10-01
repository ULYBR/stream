import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SQSClient } from "@aws-sdk/client-sqs";
import { EnvironmentVariables } from "@app/config/env.config";

@Injectable()
export class SqsClient {
    private sqsInstance: SQSClient;

    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {
        this.sqsInstance = new SQSClient({
            endpoint:
                this.configService.get<string>("sqsEndpoint") ||
                this.configService.get<string>("dynamoURI"),
            region:
                this.configService.get<string>("awsRegion") ||
                this.configService.get<string>("dynamoRegion"),
        });
    }

    getClient(): SQSClient {
        return this.sqsInstance;
    }
}
