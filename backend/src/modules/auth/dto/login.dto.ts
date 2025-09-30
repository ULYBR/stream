import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsEmail } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email address for authentication.",
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
}
