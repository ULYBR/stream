import { Module } from "@nestjs/common";
import { UserRepository } from "@app/repository/user.repository";
import { UserService } from "@app/modules/user/service/user.service";
import { DynamoCommanderWrapper } from "@app/utils/dynamoCommands";
import { UserController } from "@app/modules/user/controller/user.controller";
import { DynamoClient } from "@app/providers/dynamo.client";

@Module({
    providers: [
        DynamoCommanderWrapper,
        DynamoClient,
        UserRepository,
        UserService,
    ],
    controllers: [UserController],
    exports: [UserRepository],
})
export class UserModule { }
