import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  InternalServerErrorException,
  Req,
  UseGuards,
  ExecutionContext,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { UpdateUserDto } from "@app/modules/user/dto/update-user.dto";
import { UserService } from "@app/modules/user/service/user.service";
import { AvatarService } from "@app/modules/user/service/avatar.service";
import { Logger } from "nestjs-pino";
import { JwtAuthGuard } from "@app/modules/auth/provider/jwt-auth.guard";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MasterRoleGuard } from "@app/modules/user/guard/master-role.guard";
import { User } from "@app/types/user.type";
import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags("User")
@Controller("api/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
    private readonly logger: Logger,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload user avatar" })
  @ApiResponse({ status: 201, description: "Avatar uploaded successfully." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async uploadAvatar(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    try {
      const buffer = file.buffer;
      const mimeType = file.mimetype;
      const url = await this.avatarService.uploadAvatar(
        userId,
        buffer,
        mimeType,
      );
      this.logger.log({ msg: "Avatar uploaded", userId, url });
      return { message: "Avatar uploaded", url };
    } catch (error) {
      this.logger.error({ msg: "Error uploading avatar", error });
      throw new InternalServerErrorException("Error uploading avatar");
    }
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log({ msg: "User creation attempt" });
    try {
      const user = await this.userService.createUser(createUserDto);
      this.logger.log({ msg: "User created successfully", userId: user?.id });
      return { message: "User created", user };
    } catch (error) {
      this.logger.error({ msg: "Error creating user", error });
      throw new InternalServerErrorException("Error creating user");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  @ApiOperation({ summary: "Update an existing user" })
  @ApiParam({ name: "id", required: true, description: "User ID" })
  @ApiResponse({ status: 200, description: "User updated successfully." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const requester: User = req.user;
    if (updateUserDto.role) {
      MasterRoleGuard.prototype.canActivate({
        switchToHttp: () => ({ getRequest: () => req }),
      } as ExecutionContext);
    }
    this.logger.log({
      msg: "User update attempt",
      userId: id,
      requesterId: requester.id,
    });
    try {
      const user = await this.userService.updateUser(requester, {
        ...updateUserDto,
        id,
      });
      this.logger.log({ msg: "User updated successfully", userId: user?.id });
      return { message: "User updated", user };
    } catch (error) {
      this.logger.error({ msg: "Error updating user", error });
      throw new InternalServerErrorException("Error updating user");
    }
  }
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile returned successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @Post("me")
  async getProfile(@Req() req: Request) {
    const requester: User = (req as AuthenticatedRequest).user;
    this.logger.log({ msg: "User profile requested", userId: requester.id });
    const user = await this.userService.getUserById(requester.id);
    return { message: "User profile", user };
  }
}
