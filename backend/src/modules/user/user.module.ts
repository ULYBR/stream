import { Module } from "@nestjs/common";
import { UserRepository } from "@app/repository/user.repository";
import { UserService } from "@app/modules/user/service/user.service";
import { AvatarService } from "@app/modules/user/service/avatar.service";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { UserController } from "@app/modules/user/controller/user.controller";
import { DynamoClient } from "@app/providers/dynamo.client";
import { AuthModule } from "@app/modules/auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [
    DynamoCommanderWrapper,
    DynamoClient,
    UserRepository,
    UserService,
    AvatarService,
  ],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
