import { Controller, Post, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { UserService } from "@app/modules/user/service/user.service";

@ApiTags("User")
@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put()
  @ApiOperation({ summary: "Update an existing user" })
  @ApiResponse({ status: 200, description: "User updated successfully." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async update(@Body() updateUserDto: CreateUserDto) {
    return { message: "User updated", user: updateUserDto };
  }
}
