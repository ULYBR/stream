import { Module } from "@nestjs/common";
import { ChatGateway } from "@app/modules/chat/gateway/chat.gateway";
import { ChatService } from "@app/modules/chat/service/chat.service";
import { EventPublisherService } from "@app/providers/event-publisher.service";
import { SqsClient } from "@app/providers/sqs.client";
import { SqsUtil } from "@app/utils/sqs.util";

@Module({
  providers: [
    ChatGateway,
    ChatService,
    EventPublisherService,
    SqsClient,
    SqsUtil,
  ],
  exports: [ChatService],
})
export class ChatModule { }
