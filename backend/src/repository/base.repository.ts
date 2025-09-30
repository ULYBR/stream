import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { InternalServerErrorException } from "@nestjs/common";

export abstract class BaseRepository<EntityType> {
  protected abstract tableName: string;

  constructor(protected readonly dynamoCommands: DynamoCommanderWrapper) {}

  async create(data: EntityType): Promise<void> {
    try {
      await this.dynamoCommands.putItem(
        this.tableName,
        marshall(data, { removeUndefinedValues: true }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error inserting data into ${this.tableName}: ${error}`,
      );
    }
  }

  async findByKey(
    findByKeyParams: Record<string, string>,
  ): Promise<EntityType | null> {
    try {
      const result = await this.dynamoCommands.getItem(
        this.tableName,
        findByKeyParams,
      );
      return result.Item ? (unmarshall(result.Item) as EntityType) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving data from ${this.tableName}: ${error}`,
      );
    }
  }

  async findWithQuery(
    keyIndex: string,
    findByKeyParams: Record<string, string>,
  ): Promise<EntityType | null> {
    try {
      const result = await this.dynamoCommands.getByQuery(
        this.tableName,
        keyIndex,
        findByKeyParams,
      );
      return result.Items ? (unmarshall(result.Items[0]) as EntityType) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving data from ${this.tableName}: ${error}`,
      );
    }
  }

  async update({
    key,
    sortKey,
    data,
  }: {
    key: string;
    sortKey?: string;
    data: Partial<EntityType>;
  }): Promise<void> {
    try {
      await this.dynamoCommands.updateItem({
        tableName: this.tableName,
        PK: key,
        sortKey,
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating data in ${this.tableName}: ${error}`,
      );
    }
  }

  async delete(key: string, sortKey?: string): Promise<boolean> {
    try {
      await this.dynamoCommands.deleteItem(this.tableName, key, sortKey);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting data from ${this.tableName}: ${error}`,
      );
    }
  }
}
