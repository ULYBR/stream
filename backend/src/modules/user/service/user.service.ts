import { Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { UpdateUserDto } from "@app/modules/user/dto/update-user.dto";
import { UserRepository } from "@app/repository/user.repository";
import { User, UserRole } from "@app/types/user.type";
import { UserSafeResponse } from "@app/types/user.type";
import { UserPersistence } from "@app/types/user.persistence.type";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserService {
  /**
   * Remove dados sensíveis do usuário antes de retornar para o controller
   */
  static toSafeResponse(user: Partial<User>): UserSafeResponse {
    if (!user) return null;
    // Nunca retorna password, pk, sk, etc
    const {
      id,
      email,
      name,
      role,
      avatar,
      createdAt,
      updatedAt,
      bio,
      followersCount,
      followingCount,
    } = user;
    return {
      id,
      email,
      name,
      role,
      avatar,
      createdAt,
      updatedAt,
      bio,
      followersCount,
      followingCount,
    };
  }
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      const userPersistence: UserPersistence = {
        pk: `USER#${id}`,
        sk: `PROFILE#${id}`,
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
        role: createUserDto.role ?? UserRole.COMMON,
        createdAt: now,
      };
      const persisted = await this.userRepository.createUser(userPersistence);
      const user: User = {
        id,
        email: persisted.email,
        name: persisted.name,
        role: persisted.role as UserRole,
        avatar: persisted.avatar,
        createdAt: persisted.createdAt,
      };
      this.logger.log(`User created: ${user.email}`);
      return UserService.toSafeResponse(user);
    } catch (error) {
      this.logger.error(
        `Error creating user: ${createUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateUser(
    requester: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      if (updateUserDto.role && requester.role !== UserRole.MASTER) {
        throw new ForbiddenException("Only master can change user role");
      }
      const pk = `USER#${updateUserDto.id}`;
      const sk = `PROFILE#${updateUserDto.id}`;
      const current = await this.userRepository.getUserById(pk, sk);
      if (!current) throw new Error("User not found");
      const userPersistence: UserPersistence = {
        ...current,
        name: updateUserDto.name ?? current.name,
        email: updateUserDto.email ?? current.email,
        avatar: updateUserDto.avatar ?? current.avatar,
        bio: updateUserDto.bio ?? current.bio,
        role: updateUserDto.role ?? current.role,
        updatedAt: new Date().toISOString(),
      };
      const persisted = await this.userRepository.updateUser(userPersistence);
      const user: User = {
        id: updateUserDto.id,
        email: persisted.email,
        name: persisted.name,
        role: persisted.role as UserRole,
        avatar: persisted.avatar,
        updatedAt: persisted.updatedAt,
        bio: persisted.bio,
      };
      this.logger.log(`User updated: ${user.email}`);
      return UserService.toSafeResponse(user);
    } catch (error) {
      this.logger.error(
        `Error updating user: ${updateUserDto.id}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const pk = `USER#${id}`;
      const sk = `PROFILE#${id}`;
      const persisted = await this.userRepository.getUserById(pk, sk);
      if (!persisted) return null;
      const user: User = {
        id,
        email: persisted.email,
        name: persisted.name,
        role: persisted.role as UserRole,
        avatar: persisted.avatar,
        createdAt: persisted.createdAt,
        updatedAt: persisted.updatedAt,
        bio: persisted.bio,
        followersCount: persisted.followersCount,
        followingCount: persisted.followingCount,
      };
      this.logger.log(`User lookup by id: ${id}`);
      return UserService.toSafeResponse(user);
    } catch (error) {
      this.logger.error(`Error fetching user by id: ${id}`, error.stack);
      throw error;
    }
  }
}
