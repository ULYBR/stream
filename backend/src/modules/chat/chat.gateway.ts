import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
@WebSocketGateway({ namespace: "/chat", cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  @SubscribeMessage("sendMessage")
  handleMessage(
    @MessageBody() data: { liveId: string; user: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(
        `Message from ${data.user} in live ${data.liveId}: ${data.message}`,
      );
      this.server.to(data.liveId).emit("newMessage", data);
    } catch (error) {
      this.logger.error(
        `Error sending message from ${data.user} in live ${data.liveId}`,
        error.stack,
      );
      client.emit("error", { message: "Failed to send message." });
    }
  }

  @SubscribeMessage("joinLive")
  handleJoinLive(
    @MessageBody() data: { liveId: string; user: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(data.liveId);
      this.logger.log(`${data.user} joined live ${data.liveId}`);
      client.emit("joinedLive", { liveId: data.liveId });
    } catch (error) {
      this.logger.error(
        `Error joining live ${data.liveId} for user ${data.user}`,
        error.stack,
      );
      client.emit("error", { message: "Failed to join live." });
    }
  }
}
