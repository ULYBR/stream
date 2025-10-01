import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email address for registration.",
    minLength: 5,
    maxLength: 255,
  })
  @IsEmail()
  @MinLength(5)
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: "StrongPassword!2025",
    description: "User password. Minimum 8 characters.",
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "User full name.",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "https://avatar.example.com/john.jpg",
    description: "User avatar URL (optional).",
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
