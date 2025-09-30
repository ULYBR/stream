import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserRole } from "@app/types/user.type";

export class UpdateUserDto {
  @ApiProperty({ example: "uuid-v4", description: "User ID" })
  @IsString()
  id: string;

  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user.",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email address.",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: "https://cdn.example.com/avatars/user.jpg",
    description: "User avatar URL.",
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: "Full Stack Developer",
    description: "User bio.",
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

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
