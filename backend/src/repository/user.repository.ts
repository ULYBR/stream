import { Injectable } from "@nestjs/common";
import { BaseRepository } from "@app/repository/base.repository";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { KeyPrefix, createPrefix } from "@app/utils/create-prefix.util";
import { RedisUtil } from "@app/utils/redis.util";
import { ConfigService } from "@nestjs/config";
import { User, UserRole } from "@app/types/user.type";
import { UserPersistence } from "@app/types/user.persistence.type";

@Injectable()
export class UserRepository extends BaseRepository<UserPersistence> {
  protected tableName = "User";
  private readonly redisPrefix = KeyPrefix.User;
  private readonly redisUtil: RedisUtil;
  private readonly cacheTTL: number = 1800;

  constructor(
    dynamoCommands: DynamoCommanderWrapper,
    configService: ConfigService,
  ) {
    super(dynamoCommands);
    this.redisUtil = new RedisUtil(configService);
  }

  async createUser(user: UserPersistence): Promise<UserPersistence> {
    await this.create(user);
    const cacheKey = createPrefix(this.redisPrefix, user.email);
    await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }

  async updateUser(user: UserPersistence): Promise<UserPersistence> {
    await this.update({ key: user.pk, data: user });
    const cacheKey = createPrefix(this.redisPrefix, user.email);
    await this.redisUtil.del(cacheKey);
    await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }

  async getUserById(pk: string, sk: string): Promise<UserPersistence | null> {
    const cacheKey = createPrefix(this.redisPrefix, pk);
    const cached = await this.redisUtil.get<UserPersistence>(cacheKey);
    if (cached) return cached;
    const user = await this.findByKey({ pk, sk });
    if (user) await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }
}
