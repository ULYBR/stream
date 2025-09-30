import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { UserRole } from "@app/types/user.type";

@Injectable()
export class MasterRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.role !== UserRole.MASTER) {
      throw new ForbiddenException("Only master users can perform this action");
    }
    return true;
  }
}
