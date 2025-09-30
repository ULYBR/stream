export const loadConfig: { [key: string]: Partial<EnvironmentVariables> } = {
  dev: {
    dynamoURI: "http://dev-dynamodb:4566",
    awsRegion: "us-east-1",
    avatarBucket: "streaming-avatar-bucket",
  },
  prod: {
    dynamoURI: "http://prod-dynamodb:4566",
    awsRegion: "us-east-1",
    avatarBucket: "streaming-avatar-bucket",
  },
  local: {
    dynamoURI: "http://localhost:4566",
    awsRegion: "us-east-1",
    avatarBucket: "streaming-avatar-bucket",
  },
};

export interface EnvironmentVariables {
  awsRegion?: string;
  avatarBucket?: string;
  dynamoURI: string;
  dynamoRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  sqsEndpoint?: string;
  snsEndpoint?: string;
  jwtSecret?: string;
  externalServiceUrl?: string;
  logLevel?: string;
  appName?: string;
  frontendUrl?: string;
  port?: number;
}
