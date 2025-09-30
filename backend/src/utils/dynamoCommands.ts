import { Injectable } from "@nestjs/common";

import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { DynamoClient } from "@app/providers/dynamo.client";

@Injectable()
export class DynamoCommanderWrapper {
  private client: DynamoDBClient | undefined;

  constructor(private readonly dynamoClient: DynamoClient) {
    this.client = this.dynamoClient.createDynamoInstance();
  }

  public async putItem(
    tableName: string,
    item: Record<string, AttributeValue>,
    options?: Partial<PutItemCommandInput>,
  ) {
    await this.client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: item,
        ...options,
      }),
    );
  }

  public async updateItem({
    tableName,
    PK,
    sortKey,
    data,
  }: {
    tableName: string;
    PK: string;
    sortKey?: string;
    data: Record<string, unknown>;
  }) {
    const keyObject = { PK };
    if (sortKey) {
      keyObject["SK"] = sortKey;
    }

    const updateExpression = this.createUpdateExpression(data);
    const expressionAttributeNames = this.createExpressionAttributeNames(data);
    const expressionAttributeValues =
      this.createExpressionAttributeValues(data);

    const result = await this.client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: marshall({ ...keyObject }),
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        ReturnValues: "ALL_NEW",
      }),
    );

    return result;
  }

  public async getItem(tableName: string, keyObject: Record<string, string>) {
    const result = await this.client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: marshall(keyObject),
      }),
    );
    return result;
  }

  public async getByQuery(
    tableName: string,
    indexName: string,
    keyCondition: Record<string, string>,
  ) {
    const expressionKeys = Object.keys(keyCondition);
    if (expressionKeys.length === 0) {
      throw new Error("keyCondition must have at least one key");
    }

    const keyConditionExpression = expressionKeys
      .map((key) => `${key} = :${key}`)
      .join(" AND ");

    const expressionAttributeValues = Object.entries(keyCondition).reduce(
      (acc, [key, value]) => {
        acc[`:${key}`] = { S: value };
        return acc;
      },
      {} as Record<string, { S: string }>,
    );

    const result = await this.client.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    );

    return result;
  }

  public async getItems(
    tableName: string,
    key: string,
  ): Promise<QueryCommandOutput> {
    return await this.client.send(
      new QueryCommand({
        TableName: tableName,
        Select: "ALL_ATTRIBUTES",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": {
            S: key,
          },
        },
      }),
    );
  }

  public async deleteItem(tableName: string, PK: string, sortKey?: string) {
    const keyObject = { PK };
    if (sortKey) {
      keyObject["SK"] = sortKey;
    }

    await this.client.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: marshall({ ...keyObject }),
      }),
    );
    return true;
  }

  private createUpdateExpression(data: Record<string, unknown>): string {
    const keys = Object.keys(data);
    return keys.map((key) => `#${key} = :${key}`).join(", ");
  }

  private createExpressionAttributeNames(
    data: Record<string, unknown>,
  ): Record<string, string> {
    return Object.keys(data).reduce(
      (acc, key) => {
        acc[`#${key}`] = key;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  private createExpressionAttributeValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.keys(data).reduce(
      (acc, key) => {
        acc[`:${key}`] = data[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
}
