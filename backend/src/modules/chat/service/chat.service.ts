import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { Server, Socket } from "socket.io";
import { SendMessageDto } from "@app/modules/chat/dto/send-message.dto";
import { JoinLiveDto } from "@app/modules/chat/dto/join-live.dto";

@Injectable()
export class ChatService {
  constructor(private readonly logger: Logger) {}

  async handleSendMessage(
    server: Server,
    client: Socket,
    data: SendMessageDto,
  ): Promise<void> {
    this.logger.debug(
      { liveId: data.liveId, user: data.user },
      "ChatService.handleSendMessage called",
    );

    try {
      server.to(data.liveId).emit("newMessage", {
        id: `msg-${Date.now()}`,
        liveId: data.liveId,
        user: data.user,
        message: data.message,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        { liveId: data.liveId, user: data.user },
        "Message sent successfully",
      );
    } catch (error) {
      this.logger.error(
        { liveId: data.liveId, user: data.user, error },
        "Error sending message",
      );
      client.emit("error", { message: "Failed to send message" });
      throw error;
    }
  }

  async handleJoinLive(
    server: Server,
    client: Socket,
    data: JoinLiveDto,
  ): Promise<void> {
    this.logger.debug(
      { liveId: data.liveId, user: data.user },
      "ChatService.handleJoinLive called",
    );

    try {
      await client.join(data.liveId);

      client.to(data.liveId).emit("userJoined", {
        user: data.user,
        timestamp: new Date().toISOString(),
      });

      client.emit("joinedLive", {
        liveId: data.liveId,
        message: `Successfully joined live ${data.liveId}`,
      });

      this.logger.log(
        { liveId: data.liveId, user: data.user },
        "User joined live successfully",
      );
    } catch (error) {
      this.logger.error(
        { liveId: data.liveId, user: data.user, error },
        "Error joining live",
      );
      client.emit("error", { message: "Failed to join live" });
      throw error;
    }
  }

  async handleLeaveLive(
    server: Server,
    client: Socket,
    data: JoinLiveDto,
  ): Promise<void> {
    this.logger.debug(
      { liveId: data.liveId, user: data.user },
      "ChatService.handleLeaveLive called",
    );

    try {
      await client.leave(data.liveId);

      client.to(data.liveId).emit("userLeft", {
        user: data.user,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        { liveId: data.liveId, user: data.user },
        "User left live successfully",
      );
    } catch (error) {
      this.logger.error(
        { liveId: data.liveId, user: data.user, error },
        "Error leaving live",
      );
      throw error;
    }
  }
}
