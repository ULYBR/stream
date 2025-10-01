import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { SqsUtil } from "@app/utils/sqs.util";
import { ChatEvent } from "@app/types/events.types";

@Injectable()
export class ChatProcessor {
    constructor(
        private readonly sqsUtil: SqsUtil,
        private readonly logger: Logger,
    ) { }

    /**
     * Processa mensagens da fila de chat
     */
    async processMessages(): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("chat-events");

        await this.sqsUtil.processMessages(queueUrl, async (event: ChatEvent) => {
            await this.handleChatEvent(event);
        });
    }

    /**
     * Processa um evento de chat específico
     */
    private async handleChatEvent(event: ChatEvent): Promise<void> {
        this.logger.log(`Processing chat event: ${event.type}`, {
            eventId: event.id,
            streamId: event.metadata?.streamId,
            userId: event.metadata?.userId
        });

        switch (event.type) {
            case "Message Sent":
                await this.handleMessageSent(event);
                break;
            case "User Joined Chat":
                await this.handleUserJoinedChat(event);
                break;
            case "User Left Chat":
                await this.handleUserLeftChat(event);
                break;
            case "Moderator Action":
                await this.handleModeratorAction(event);
                break;
            default:
                this.logger.warn(`Unknown chat event type: ${event.type}`);
        }
    }

    /**
     * Processa mensagem enviada no chat
     */
    private async handleMessageSent(event: ChatEvent): Promise<void> {
        // TODO: Salvar mensagem no DynamoDB
        // TODO: Atualizar métricas de chat
        // TODO: Filtro de spam/moderação

        this.logger.log("Message sent processed", {
            messageId: event.data.messageId,
            streamId: event.data.streamId,
            userId: event.data.userId,
        });
    }

    /**
     * Processa usuário entrando no chat
     */
    private async handleUserJoinedChat(event: ChatEvent): Promise<void> {
        // TODO: Atualizar contador de participantes
        // TODO: Salvar evento de entrada
        // TODO: Notificar moderadores se necessário

        this.logger.log("User joined chat processed", {
            streamId: event.data.streamId,
            userId: event.data.userId,
        });
    }

    /**
     * Processa usuário saindo do chat
     */
    private async handleUserLeftChat(event: ChatEvent): Promise<void> {
        // TODO: Atualizar contador de participantes
        // TODO: Salvar evento de saída

        this.logger.log("User left chat processed", {
            streamId: event.data.streamId,
            userId: event.data.userId,
        });
    }

    /**
     * Processa ação de moderador
     */
    private async handleModeratorAction(event: ChatEvent): Promise<void> {
        // TODO: Aplicar ação de moderação
        // TODO: Salvar log de moderação
        // TODO: Notificar usuário afetado

        this.logger.log("Moderator action processed", {
            action: event.data.action,
            streamId: event.data.streamId,
            userId: event.data.userId,
        });
    }
}