import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "nestjs-pino";
import { Server, Socket } from "socket.io";
import { ChatService } from "@app/modules/chat/service/chat.service";
import { SendMessageDto } from "@app/modules/chat/dto/send-message.dto";
import { JoinLiveDto } from "@app/modules/chat/dto/join-live.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly logger: Logger,
  ) {}

  handleConnection(client: Socket): void {
    this.logger.debug(
      { clientId: client.id },
      "Client connected to chat gateway",
    );
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(
      { clientId: client.id },
      "Client disconnected from chat gateway",
    );
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ): Promise<void> {
    try {
      await this.chatService.handleSendMessage(this.server, client, data);
    } catch (error) {
      this.logger.error(
        { clientId: client.id, data, error },
        "Error handling send message",
      );
    }
  }

  @SubscribeMessage("joinLive")
  async handleJoinLive(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinLiveDto,
  ): Promise<void> {
    try {
      await this.chatService.handleJoinLive(this.server, client, data);
    } catch (error) {
      this.logger.error(
        { clientId: client.id, data, error },
        "Error handling join live",
      );
    }
  }

  @SubscribeMessage("leaveLive")
  async handleLeaveLive(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinLiveDto,
  ): Promise<void> {
    try {
      await this.chatService.handleLeaveLive(this.server, client, data);
    } catch (error) {
      this.logger.error(
        { clientId: client.id, data, error },
        "Error handling leave live",
      );
    }
  }
}
