import { Module } from "@nestjs/common";

import { StreamsRepository } from "@app/repository/streams.repository";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { DynamoClient } from "@app/providers/dynamo.client";
import { StreamsController } from "@app/modules/streams/controller/streams.controller";
import { StreamsService } from "@app/modules/streams/service/streams.service";
import { EventPublisherService } from "@app/providers/event-publisher.service";
import { SqsClient } from "@app/providers/sqs.client";
import { SqsUtil } from "@app/utils/sqs.util";

@Module({
    controllers: [StreamsController],
    providers: [
        StreamsService,
        StreamsRepository,
        DynamoCommanderWrapper,
        DynamoClient,
        EventPublisherService,
        SqsClient,
        SqsUtil,
    ],
    exports: [StreamsService],
})
export class StreamsModule { }
