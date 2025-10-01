import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import {
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    Message,
    SQSClient,
} from "@aws-sdk/client-sqs";
import { SqsClient } from "@app/providers/sqs.client";
import {
    StreamEvent,
    ChatEvent,
    UserEvent,
    SystemEvent,
} from "@app/types/events.types";

@Injectable()
export class SqsUtil {
    private sqsClient: SQSClient;

    constructor(
        private readonly sqsClientProvider: SqsClient,
        private readonly logger: Logger,
    ) {
        this.sqsClient = this.sqsClientProvider.getClient();
    }

    /**
     * Envia mensagem para uma fila SQS
     */
    async sendMessage(
        queueUrl: string,
        event: StreamEvent | ChatEvent | UserEvent | SystemEvent,
    ): Promise<void> {
        if (!queueUrl) {
            this.logger.warn("Queue URL not configured, skipping message send");
            return;
        }

        try {
            const command = new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify(event),
                MessageAttributes: {
                    eventType: {
                        DataType: "String",
                        StringValue: event.type,
                    },
                    source: {
                        DataType: "String",
                        StringValue: event.source,
                    },
                    eventId: {
                        DataType: "String",
                        StringValue: event.id,
                    },
                },
            });

            const result = await this.sqsClient.send(command);
            this.logger.log(
                `Message sent to SQS: ${event.type} - MessageId: ${result.MessageId}`,
            );
        } catch (error) {
            this.logger.error("Failed to send message to SQS:", error);
            throw error;
        }
    }

    /**
     * Recebe mensagens de uma fila SQS
     */
    async receiveMessages(
        queueUrl: string,
        maxMessages: number = 10,
    ): Promise<Message[]> {
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: maxMessages,
                WaitTimeSeconds: 10,
                MessageAttributeNames: ["All"],
            });

            const result = await this.sqsClient.send(command);
            return result.Messages || [];
        } catch (error) {
            this.logger.error("Failed to receive messages from SQS:", error);
            throw error;
        }
    }

    /**
     * Deleta mensagem processada da fila SQS
     */
    async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
        try {
            const command = new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            });

            await this.sqsClient.send(command);
            this.logger.debug("Message deleted from SQS");
        } catch (error) {
            this.logger.error("Failed to delete message from SQS:", error);
            throw error;
        }
    }

    /**
     * Processa mensagens de uma fila específica
     */
    async processMessages(
        queueUrl: string,
        processor: (event: any) => Promise<void>,
    ): Promise<void> {
        const messages = await this.receiveMessages(queueUrl);

        for (const message of messages) {
            try {
                const event = JSON.parse(message.Body || "{}");
                await processor(event);
                await this.deleteMessage(queueUrl, message.ReceiptHandle || "");

                this.logger.log(`Message processed successfully: ${event.type}`);
            } catch (error) {
                this.logger.error("Failed to process message:", error);
                // Mensagem ficará na fila para retry ou irá para DLQ
            }
        }
    }

    /**
     * Utilitário para criar URL de fila baseado no ambiente
     */
    getQueueUrl(queueName: string): string {
        const baseUrl = process.env.SQS_ENDPOINT || "http://localstack:4566";
        const accountId = process.env.AWS_ACCOUNT_ID || "000000000000";
        return `${baseUrl}/${accountId}/${queueName}`;
    }
}