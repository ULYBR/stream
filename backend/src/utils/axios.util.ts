import { redactSensitiveData } from "@app/utils/logging/sensitiveDataRedaction.util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import https from "https";
import { Logger } from "nestjs-pino";

@Injectable()
export class AxiosHttpClient {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  createAxiosInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
      baseURL,
      responseType: "text",
      validateStatus: () => true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const env = this.configService.get("env");

    instance.interceptors.request.use((reqConfig) => {
      this.logger.debug(
        `Start request: ${JSON.stringify({
          url: reqConfig.url,
          headers: redactSensitiveData(reqConfig.headers, env),
          params: redactSensitiveData(reqConfig.params, env),
          body: redactSensitiveData(reqConfig.data, env),
        })}`,
      );

      reqConfig.headers["x-trace-id"] = global.traceId;

      return reqConfig;
    });

    instance.interceptors.response.use((response) => {
      const data = response.config.data;
      const startTime = new Date(data.startTime);
      const endTime = new Date();
      const requestDuration = endTime.valueOf() - startTime.valueOf();

      response.config.data = { startTime, endTime, requestDuration };

      return response;
    });

    return instance;
  };
}
