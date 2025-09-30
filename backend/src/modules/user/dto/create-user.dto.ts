import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { UserRole } from "@app/types/user.type";

export class CreateUserDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email address.",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "Full name of the user." })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "StrongPassword!2025",
    description: "User password.",
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    example: UserRole.COMMON,
    enum: UserRole,
    description: "User role.",
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
