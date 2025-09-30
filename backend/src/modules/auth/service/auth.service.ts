import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { LoginDto } from "@app/modules/auth/dto/login.dto";
import { JwtProvider } from "@app/modules/auth/provider/jwt.provider";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtProvider: JwtProvider,
    private readonly logger: Logger,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.debug({ email: loginDto.email }, "AuthService.login chamado");
    try {
      if (
        loginDto.email === "admin@admin.com" &&
        loginDto.password === "admin"
      ) {
        this.logger.log({ email: loginDto.email, msg: "Credenciais válidas" });
        return {
          token: this.jwtProvider.generateToken({
            email: loginDto.email,
            role: "admin",
          }),
          expiresIn: this.jwtProvider.getExpiration(),
          permissions: ["admin", "user"],
        };
      }
      this.logger.warn({ email: loginDto.email, msg: "Credenciais inválidas" });
      return null;
    } catch (error) {
      this.logger.error(
        { email: loginDto.email, error },
        "Erro ao realizar login",
      );
      throw error;
    }
  }
}
