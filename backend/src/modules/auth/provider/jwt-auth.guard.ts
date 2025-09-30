import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtProvider } from "@app/modules/auth/provider/jwt.provider";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtProvider: JwtProvider) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = this.jwtProvider.verifyToken(token);
    if (!payload || typeof payload === "string") {
      throw new UnauthorizedException("Invalid token");
    }
    request.user = payload;
    return true;
  }
}
