import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { LoginDto } from "@app/modules/auth/dto/login.dto";
import { JwtProvider } from "@app/modules/auth/provider/jwt.provider";
import { User, UserRole } from "@app/types/user.type";
import { UserRepository } from "@app/repository/user.repository";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtProvider: JwtProvider,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.debug({ email: loginDto.email }, "AuthService.login chamado");
    try {
      const pk = `USER#${loginDto.email}`;
      const sk = `PROFILE#${loginDto.email}`;
      const userPersistence = await this.userRepository.getUserById(pk, sk);

      if (!userPersistence) {
        this.logger.error(
          { email: loginDto.email, msg: "User not found" },
          "AuthService.login error",
        );
        throw new UnauthorizedException("Invalid credentials");
      }

      const passwordValid = await bcrypt.compare(
        loginDto.password,
        userPersistence.password,
      );
      if (!passwordValid) {
        this.logger.error(
          { email: loginDto.email, msg: "Invalid password" },
          "AuthService.login error",
        );
        throw new UnauthorizedException("Invalid credentials");
      }

      if (userPersistence.role !== UserRole.MASTER) {
        this.logger.error(
          {
            email: loginDto.email,
            msg: "User does not have MASTER role",
          },
          "AuthService.login error",
        );
        throw new UnauthorizedException("Insufficient permissions");
      }
      const user: User = {
        id: userPersistence.pk.replace("USER#", ""),
        name: userPersistence.name,
        email: userPersistence.email,
        avatar: userPersistence.avatar,
        createdAt: userPersistence.createdAt,
        role: userPersistence.role as UserRole,
      };
      const token = this.jwtProvider.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      this.logger.log({ email: loginDto.email, msg: "Login successful" });
      return {
        token,
        expiresIn: this.jwtProvider.getExpiration(),
        user,
      };
    } catch (error) {
      this.logger.error(
        { email: loginDto.email, error },
        "Erro ao realizar login",
      );
      throw error;
    }
  }
}
