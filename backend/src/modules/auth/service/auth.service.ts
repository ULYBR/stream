import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { LoginDto } from "@app/modules/auth/dto/login.dto";
import { RegisterDto } from "@app/modules/auth/dto/register.dto";
import { JwtProvider } from "@app/modules/auth/provider/jwt.provider";
import { User, UserRole } from "@app/types/user.type";
import { UserPersistence } from "@app/types/user.persistence.type";
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
      const userPersistence = await this.validateUserCredentials(loginDto);
      this.validateUserPermissions(userPersistence, loginDto.email);
      const user = this.mapUserFromPersistence(userPersistence);
      const authResponse = this.generateAuthResponse(user);

      this.logger.log({ email: loginDto.email, msg: "Login successful" });
      return authResponse;
    } catch (error) {
      this.logger.error(
        { email: loginDto.email, error },
        "Erro ao realizar login",
      );
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    this.logger.debug(
      { email: registerDto.email },
      "AuthService.register chamado",
    );
    try {
      await this.checkUserExists(registerDto.email);
      const userData = await this.createUserData(registerDto);
      await this.userRepository.createUser(userData);

      const user = this.mapUserFromRegister(registerDto, userData.createdAt);
      const authResponse = this.generateAuthResponse(user);

      this.logger.log({ email: registerDto.email }, "Registration successful");
      return authResponse;
    } catch (error) {
      this.logger.error(
        { email: registerDto.email, error },
        "Erro ao realizar registro",
      );
      throw error;
    }
  }

  private async validateUserCredentials(loginDto: LoginDto) {
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

    return userPersistence;
  }

  private validateUserPermissions(
    userPersistence: UserPersistence,
    email: string,
  ) {
    if (userPersistence.role !== UserRole.MASTER) {
      this.logger.error(
        {
          email: email,
          msg: "User does not have MASTER role",
        },
        "AuthService.login error",
      );
      throw new UnauthorizedException("Insufficient permissions");
    }
  }

  private mapUserFromPersistence(userPersistence: UserPersistence): User {
    return {
      id: userPersistence.pk.replace("USER#", ""),
      name: userPersistence.name,
      email: userPersistence.email,
      avatar: userPersistence.avatar,
      createdAt: userPersistence.createdAt,
      role: userPersistence.role as UserRole,
    };
  }

  private mapUserFromRegister(
    registerDto: RegisterDto,
    createdAt: string,
  ): User {
    return {
      id: registerDto.email,
      name: registerDto.name,
      email: registerDto.email,
      avatar: registerDto.avatar || "",
      createdAt: createdAt,
      role: UserRole.COMMON,
    };
  }

  private generateAuthResponse(user: User) {
    const token = this.jwtProvider.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      expiresIn: this.jwtProvider.getExpiration(),
      user,
    };
  }

  private async checkUserExists(email: string) {
    const pk = `USER#${email}`;
    const sk = `PROFILE#${email}`;
    const existingUser = await this.userRepository.getUserById(pk, sk);

    if (existingUser) {
      this.logger.error({ email }, "User already exists");
      throw new BadRequestException("User already exists");
    }
  }

  private async createUserData(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const pk = `USER#${registerDto.email}`;
    const sk = `PROFILE#${registerDto.email}`;

    return {
      pk,
      sk,
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      avatar: registerDto.avatar || "",
      role: UserRole.COMMON,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
