import { Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { UserRepository } from "@app/repository/user.repository";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.createUser(createUserDto);
      this.logger.log(`User created: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error creating user: ${createUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateUser(updateUserDto: CreateUserDto & { id: string }) {
    try {
      const user = await this.userRepository.updateUser(updateUserDto);
      this.logger.log(`User updated: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error updating user: ${updateUserDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.getUserById(id);
      this.logger.log(`User lookup by id: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by id: ${id}`, error.stack);
      throw error;
    }
  }
}
