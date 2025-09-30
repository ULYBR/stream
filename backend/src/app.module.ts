import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import configuration from "@app/config/env.config";
import { UserModule } from "@app/modules/user/user.module";
import { ChatModule } from "@app/modules/chat/chat.module";
import { HealthModule } from "@app/modules/health/health.module";
import { LoggerMiddleware } from "@app/utils/logging/logger.middleware";
import { AuthModule } from "@app/modules/auth/auth.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {},
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    UserModule,
    ChatModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "health/(.*)", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
