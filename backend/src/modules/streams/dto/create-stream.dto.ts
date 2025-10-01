import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateStreamDto {
  @ApiProperty({
    example: "Minha Live de Programação",
    description: "Stream title.",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: "Hoje vamos aprender React!",
    description: "Stream description.",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: ["programming", "react"],
    description: "Stream tags.",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: "Programming",
    description: "Stream category.",
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
