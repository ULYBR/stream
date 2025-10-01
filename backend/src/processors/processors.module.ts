import { Module } from "@nestjs/common";
import { ChatProcessor } from "@app/processors/chat.processor";
import { StreamProcessor } from "@app/processors/stream.processor";
import { UserProcessor } from "@app/processors/user.processor";
import { SystemProcessor } from "@app/processors/system.processor";
import { SqsClient } from "@app/providers/sqs.client";
import { SqsUtil } from "@app/utils/sqs.util";

@Module({
    providers: [
        ChatProcessor,
        StreamProcessor,
        UserProcessor,
        SystemProcessor,
        SqsClient,
        SqsUtil,
    ],
    exports: [
        ChatProcessor,
        StreamProcessor,
        UserProcessor,
        SystemProcessor,
    ],
})
export class ProcessorsModule { }