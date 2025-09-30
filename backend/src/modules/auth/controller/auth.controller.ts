import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "@app/modules/auth/service/auth.service";
import { LoginDto } from "@app/modules/auth/dto/login.dto";
import { Logger } from "nestjs-pino";

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Authenticate user and return JWT token." })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login successful. Returns JWT token and expiration.",
    schema: {
      example: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expiresIn: "3600",
      },
    },
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 400, description: "Validation error." })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; expiresIn: string }> {
    this.logger.log({ email: loginDto.email, msg: "Login attempt" });
    try {
      const result = await this.authService.login(loginDto);
      if (result && result.token) {
        this.logger.log({ email: loginDto.email, msg: "Login successful" });
        return {
          token: result.token,
          expiresIn: result.expiresIn,
        };
      } else {
        this.logger.warn({ email: loginDto.email, msg: "Login failed" });
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      this.logger.error({ email: loginDto.email, error, msg: "Login error" });
      throw error;
    }
  }
}
