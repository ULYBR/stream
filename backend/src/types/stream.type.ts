export enum StreamStatus {
  LIVE = "live",
  OFFLINE = "offline",
  SCHEDULED = "scheduled",
}

export interface Stream {
  id: string;
  title: string;
  description: string;
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

export type StreamResponse = Stream;
