import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { BaseRepository } from "@app/repository/base.repository";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { KeyPrefix, createPrefix } from "@app/utils/create-prefix.util";
import { RedisUtil } from "@app/utils/redis.util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserRepository extends BaseRepository<CreateUserDto> {
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

  async createUser(user: CreateUserDto): Promise<CreateUserDto> {
    await this.create(user);
    const cacheKey = createPrefix(this.redisPrefix, user.email);
    await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }

  async updateUser(
    user: CreateUserDto & { id: string },
  ): Promise<CreateUserDto & { id: string }> {
    await this.update({ key: user.id, data: user });
    const cacheKey = createPrefix(this.redisPrefix, user.email);
    await this.redisUtil.del(cacheKey);
    await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }

  async getUserById(id: string): Promise<CreateUserDto | null> {
    const cacheKey = createPrefix(this.redisPrefix, id);
    const cached = await this.redisUtil.get<CreateUserDto>(cacheKey);
    if (cached) return cached;
    const user = await this.findByKey({ id });
    if (user) await this.redisUtil.set(cacheKey, user, this.cacheTTL);
    return user;
  }
}
