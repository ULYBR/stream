import { loadConfig } from "@app/config/env-vars.config";

const env = process.env;
const NODE_ENV = env.NODE_ENV ?? "local";

export default () => ({
  awsRegion: env.AWS_REGION ?? "us-east-1",
  avatarBucket: env.AVATAR_BUCKET ?? "streaming-avatar-bucket",
  port: Number(env.PORT ?? 3000),
  dynamoURI: env.DYNAMODB_ENDPOINT ?? loadConfig[NODE_ENV].dynamoURI,
  dynamoRegion: env.DYNAMODB_REGION ?? "us-east-1",
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID ?? "test",
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "test",
  sqsEndpoint: env.SQS_ENDPOINT ?? "http://localstack:4566",
  snsEndpoint: env.SNS_ENDPOINT ?? "http://localstack:4566",
  jwtSecret: env.JWT_SECRET ?? "supersecretkey",
  externalServiceUrl: env.EXTERNAL_SERVICE_URL ?? "http://example.com/api",
  logLevel: env.LOG_LEVEL ?? "info",
  appName: env.APP_NAME ?? "streamhub-backend",
  frontendUrl: env.FRONTEND_URL ?? "http://localhost:5173",
});

export interface EnvironmentVariables {
  awsRegion: string;
  avatarBucket: string;
  port: number;
  dynamoURI: string;
  dynamoRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  sqsEndpoint: string;
  snsEndpoint: string;
  jwtSecret: string;
  externalServiceUrl: string;
  logLevel: string;
  appName: string;
  frontendUrl: string;
}
