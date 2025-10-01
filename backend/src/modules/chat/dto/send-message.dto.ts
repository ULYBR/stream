import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
  @ApiProperty({
    description: "The ID of the live stream",
    example: "live-123",
  })
  @IsString()
  @IsNotEmpty()
  liveId: string;

  @ApiProperty({
    description: "The username of the sender",
    example: "johndoe",
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: "The message content",
    example: "Hello everyone!",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
