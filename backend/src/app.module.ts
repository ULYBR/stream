import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import configuration from "@app/config/env.config";
import { UserModule } from "@app/modules/user/user.module";
import { ChatModule } from "@app/modules/chat/chat.module";
import { HealthModule } from "@app/modules/health/health.module";
import { UserController } from "@app/modules/user/controller/user.controller";
import { UserService } from "@app/modules/user/service/user.service";
import { LoggerMiddleware } from "@app/utils/logging/logger.middleware";

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
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "health/(.*)", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
