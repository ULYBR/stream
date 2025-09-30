import { Injectable, Logger } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AvatarService {
    private readonly logger = new Logger(AvatarService.name);
    private readonly s3 = new S3Client({ region: process.env.AWS_REGION });
    private readonly bucket = process.env.AVATAR_BUCKET;

    async uploadAvatar(userId: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
        const key = `avatars/${userId}/${uuidv4()}`;
        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: fileBuffer,
                    ContentType: mimeType,
                    ACL: "public-read",
                })
            );
            this.logger.log(`Avatar uploaded for user ${userId}: ${key}`);
            return `https://${this.bucket}.s3.amazonaws.com/${key}`;
        } catch (error) {
            this.logger.error(`Error uploading avatar for user ${userId}`, error);
            throw error;
        }
    }
}
