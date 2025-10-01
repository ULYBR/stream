import { Injectable } from "@nestjs/common";
import { BaseRepository } from "@app/repository/base.repository";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { StreamStatus } from "@app/types/stream.type";

export interface StreamPersistence {
  pk: string;
  sk: string;
  title: string;
  description?: string;
  status: StreamStatus;
  userId: string;
  userName: string;
  userAvatar?: string;
  thumbnailUrl?: string;
  streamUrl?: string;
  viewerCount: number;
  tags?: string[];
  category?: string;
  startedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class StreamsRepository extends BaseRepository<StreamPersistence> {
  protected tableName = "StreamsTable";

  constructor(dynamoCommands: DynamoCommanderWrapper) {
    super(dynamoCommands);
  }

  async createStream(streamData: StreamPersistence): Promise<void> {
    await this.create(streamData);
  }

  async getStreamById(
    pk: string,
    sk: string,
  ): Promise<StreamPersistence | null> {
    return await this.findByKey({ pk, sk });
  }

  async getAllActiveStreams(): Promise<StreamPersistence[]> {
    // TODO: Implement scan/query for active streams
    return [];
  }
}
