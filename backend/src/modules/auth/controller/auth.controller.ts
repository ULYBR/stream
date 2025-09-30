import { Controller, Post, Body, Res, Req } from "@nestjs/common";
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
  async login(@Body() loginDto: LoginDto, @Res() res, @Req() req) {
    this.logger.log({ email: loginDto.email, msg: "Login attempt" });
    try {
      const result = await this.authService.login(loginDto);
      if (result && result.token) {
        this.logger.log({ email: loginDto.email, msg: "Login successful" });
        res.setHeader("X-Request-ID", req.headers["x-trace-id"] ?? "");
        return res.status(200).json({
          token: result.token,
          expiresIn: result.expiresIn,
          user: result.user
            ? {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                avatar: result.user.avatar,
                createdAt: result.user.createdAt,
              }
            : undefined,
        });
      } else {
        this.logger.error({ email: loginDto.email, msg: "Login failed" });
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      this.logger.error({ email: loginDto.email, error, msg: "Login error" });
      throw error;
    }
  }
}
