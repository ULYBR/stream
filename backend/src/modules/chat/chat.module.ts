import { Module } from "@nestjs/common";
import { ChatGateway } from "@app/modules/chat/gateway/chat.gateway";
import { ChatService } from "@app/modules/chat/service/chat.service";

@Module({
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
