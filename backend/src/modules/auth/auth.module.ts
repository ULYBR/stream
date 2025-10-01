import { Module } from "@nestjs/common";
import { forwardRef } from "@nestjs/common";
import { UserModule } from "@app/modules/user/user.module";
import { JwtProvider } from "@app/modules/auth/provider/jwt.provider";
import { JwtAuthGuard } from "@app/modules/auth/provider/jwt-auth.guard";
import { AuthService } from "@app/modules/auth/service/auth.service";

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [JwtProvider, JwtAuthGuard, AuthService],
  exports: [JwtProvider, JwtAuthGuard, AuthService],
})
export class AuthModule {}
