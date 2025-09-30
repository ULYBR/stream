import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

export type RedisValue = string | number | boolean | object | null;

export class RedisUtil {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>(
      "REDIS_URL",
      "redis://localhost:6379",
    );
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });
  }

  async set<T extends RedisValue>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    const val = typeof value === "string" ? value : JSON.stringify(value);
    await this.client.set(key, val);
    if (ttlSeconds) {
      await this.client.expire(key, ttlSeconds);
    }
  }

  async get<T extends RedisValue>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    if (typeof val !== "string" || !val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as unknown as T;
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
}
