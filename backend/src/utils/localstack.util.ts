import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

export type LocalStackContainer = {
  container: StartedTestContainer;
};

const buildContainerIp = (): string => {
  if (process.env.NODE_ENV === "ci") {
    return "172.17.0.1";
  }

  return "127.0.0.1";
};

export const startLocalStack = async (): Promise<LocalStackContainer> => {
  const AWS_REGION = "us-east-1";
  const AWS_ACCESS_KEY_ID = "dummy";
  const AWS_SECRET_ACCESS_KEY = "dummy";

  process.env["AWS_REGION"] = AWS_REGION;
  process.env["AWS_ACCESS_KEY_ID"] = AWS_ACCESS_KEY_ID;
  process.env["AWS_SECRET_ACCESS_KEY"] = AWS_SECRET_ACCESS_KEY;
  process.env["AWS_ENVIRONMENT"] = "local";
  process.env["AWS_ACCOUNT_ID"] = "000000000000";
  process.env["NODE_ENV"] = "local";

  const container = await new GenericContainer("localstack/localstack:2.3.2")
    .withEnvironment({
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_DEFAULT_REGION: AWS_REGION,
      GATEWAY_LISTEN: "0.0.0.0:4566",
    })
    .withExposedPorts(4566)
    .withWaitStrategy(Wait.forHealthCheck())
    .start();

  const containerPort = container.getMappedPort(4566);

  process.env["AWS_ENDPOINT"] = `http://${buildContainerIp()}:${containerPort}`;

  return { container };
};
