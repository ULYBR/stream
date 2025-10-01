import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JoinLiveDto {
  @ApiProperty({
    description: "The ID of the live stream to join",
    example: "live-123",
  })
  @IsString()
  @IsNotEmpty()
  liveId: string;

  @ApiProperty({
    description: "The username of the user joining",
    example: "johndoe",
  })
  @IsString()
  @IsNotEmpty()
  user: string;
}
