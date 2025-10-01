import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { SqsUtil } from "@app/utils/sqs.util";
import {
    StreamEvent,
    ChatEvent,
    UserEvent,
    SystemEvent,
} from "@app/types/events.types";

@Injectable()
export class EventPublisherService {
    constructor(
        private readonly sqsUtil: SqsUtil,
        private readonly logger: Logger,
    ) { }

    async publishStreamEvent(event: StreamEvent): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("stream-events");
        await this.sqsUtil.sendMessage(queueUrl, event);
    }

    async publishChatEvent(event: ChatEvent): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("chat-events");
        await this.sqsUtil.sendMessage(queueUrl, event);
    }

    async publishUserEvent(event: UserEvent): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("user-events");
        await this.sqsUtil.sendMessage(queueUrl, event);
    }

    async publishSystemEvent(event: SystemEvent): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("system-events");
        await this.sqsUtil.sendMessage(queueUrl, event);
    }
}