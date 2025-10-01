import { Injectable, NotFoundException } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { CreateStreamDto } from "@app/modules/streams/dto/create-stream.dto";
import { Stream, StreamStatus } from "@app/types/stream.type";
import {
  StreamsRepository,
  StreamPersistence,
} from "@app/repository/streams.repository";
import { createPrefix, KeyPrefix } from "@app/utils/create-prefix.util";

@Injectable()
export class StreamsService {
  constructor(
    private readonly logger: Logger,
    private readonly streamsRepository: StreamsRepository,
  ) {}

  async getAllStreams(): Promise<Stream[]> {
    this.logger.debug("StreamsService.getAllStreams called");
    try {
      const streamsPersistence =
        await this.streamsRepository.getAllActiveStreams();

      const streams: Stream[] = streamsPersistence.map((persistence) =>
        this.mapPersistenceToStream(persistence),
      );

      this.logger.log(
        { count: streams.length },
        "Streams retrieved successfully",
      );
      return streams;
    } catch (error) {
      this.logger.error({ error }, "Error getting all streams");
      throw error;
    }
  }

  async getStreamById(id: string): Promise<Stream> {
    this.logger.debug({ streamId: id }, "StreamsService.getStreamById called");
    try {
      const pk = createPrefix(KeyPrefix.Stream, id);
      const sk = `METADATA#${id}`;

      const streamPersistence = await this.streamsRepository.getStreamById(
        pk,
        sk,
      );

      if (!streamPersistence) {
        this.logger.error({ streamId: id }, "Stream not found");
        throw new NotFoundException("Stream not found");
      }

      const stream = this.mapPersistenceToStream(streamPersistence);

      this.logger.log({ streamId: id }, "Stream retrieved successfully");
      return stream;
    } catch (error) {
      this.logger.error({ streamId: id, error }, "Error getting stream by id");
      throw error;
    }
  }

  async createStream(
    createStreamDto: CreateStreamDto,
    userId: string,
    userName: string,
  ): Promise<Stream> {
    this.logger.debug(
      { title: createStreamDto.title, userId },
      "StreamsService.createStream called",
    );

    try {
      const streamId = `stream-${Date.now()}`;
      const now = new Date().toISOString();
      const pk = createPrefix(KeyPrefix.Stream, streamId);
      const sk = `METADATA#${streamId}`;

      const streamPersistence: StreamPersistence = {
        pk,
        sk,
        title: createStreamDto.title,
        description: createStreamDto.description,
        status: StreamStatus.SCHEDULED,
        userId,
        userName,
        viewerCount: 0,
        tags: createStreamDto.tags,
        category: createStreamDto.category,
        createdAt: now,
        updatedAt: now,
      };

      await this.streamsRepository.createStream(streamPersistence);

      const stream = this.mapPersistenceToStream(streamPersistence);

      this.logger.log(
        { streamId, title: createStreamDto.title },
        "Stream created successfully",
      );

      return stream;
    } catch (error) {
      this.logger.error(
        { title: createStreamDto.title, userId, error },
        "Error creating stream",
      );
      throw error;
    }
  }

  private mapPersistenceToStream(persistence: StreamPersistence): Stream {
    return {
      id: persistence.pk.replace(`${KeyPrefix.Stream}#`, ""),
      title: persistence.title,
      description: persistence.description || "",
      status: persistence.status,
      userId: persistence.userId,
      userName: persistence.userName,
      userAvatar: persistence.userAvatar,
      thumbnailUrl: persistence.thumbnailUrl,
      streamUrl: persistence.streamUrl,
      viewerCount: persistence.viewerCount,
      tags: persistence.tags,
      category: persistence.category,
      startedAt: persistence.startedAt,
      scheduledAt: persistence.scheduledAt,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    };
  }
}
