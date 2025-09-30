import { Module } from "@nestjs/common";
import { ChatGateway } from "@app/modules/chat/chat.gateway";

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
