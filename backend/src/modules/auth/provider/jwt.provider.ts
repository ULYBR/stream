import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
const ms = require("ms");
import { Secret } from "jsonwebtoken";

@Injectable()
export class JwtProvider {
  private readonly secret: Secret;
  private readonly expiresIn: number;
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>(
      "JWT_SECRET",
      "supersecretkey",
    );
    const expiresRaw = this.configService.get<string>("JWT_EXPIRES_IN", "1h");
    this.expiresIn =
      typeof expiresRaw === "string" ? ms(expiresRaw) : expiresRaw;
  }

  public generateToken(payload: object): string {
    try {
      this.logger.debug({ payload }, "Generating JWT token");
      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn / 1000,
      });
    } catch (error) {
      this.logger.error({ error }, "Error generating JWT token");
      throw error;
    }
  }

  public verifyToken(token: string): string | jwt.JwtPayload | null {
    try {
      this.logger.debug({ token }, "Verifying JWT token");
      return jwt.verify(token, this.secret);
    } catch (error) {
      this.logger.error({ error }, "Error verifying JWT token");
      return null;
    }
  }

  public getExpiration(): string {
    return String(this.expiresIn);
  }
}
