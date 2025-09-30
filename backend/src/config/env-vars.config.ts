export const loadConfig: { [key: string]: Partial<EnvironmentVariables> } = {
  dev: {
    dynamoURI: "http://dev-dynamodb:4566",
  },
  prod: {
    dynamoURI: "http://prod-dynamodb:4566",
  },
  local: {
    dynamoURI: "http://localhost:4566",
  },
};

export interface EnvironmentVariables {
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
