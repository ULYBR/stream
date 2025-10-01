import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { SqsUtil } from "@app/utils/sqs.util";
import { StreamEvent } from "@app/types/events.types";

@Injectable()
export class StreamProcessor {
    constructor(
        private readonly sqsUtil: SqsUtil,
        private readonly logger: Logger,
    ) { }

    /**
     * Processa mensagens da fila de streams
     */
    async processMessages(): Promise<void> {
        const queueUrl = this.sqsUtil.getQueueUrl("stream-events");

        await this.sqsUtil.processMessages(queueUrl, async (event: StreamEvent) => {
            await this.handleStreamEvent(event);
        });
    }

    /**
     * Processa um evento de stream específico
     */
    private async handleStreamEvent(event: StreamEvent): Promise<void> {
        this.logger.log(`Processing stream event: ${event.type}`, {
            eventId: event.id,
            streamId: event.data.streamId,
            userId: event.data.userId,
        });

        switch (event.type) {
            case "Stream Started":
                await this.handleStreamStarted(event);
                break;
            case "Stream Ended":
                await this.handleStreamEnded(event);
                break;
            case "Stream Updated":
                await this.handleStreamUpdated(event);
                break;
            case "Viewer Joined":
                await this.handleViewerJoined(event);
                break;
            case "Viewer Left":
                await this.handleViewerLeft(event);
                break;
            default:
                this.logger.warn(`Unknown stream event type: ${event.type}`);
        }
    }

    /**
     * Processa stream iniciada
     */
    private async handleStreamStarted(event: StreamEvent): Promise<void> {
        // TODO: Atualizar status da stream no DynamoDB
        // TODO: Notificar subscribers
        // TODO: Iniciar métricas de visualização

        this.logger.log("Stream started processed", {
            streamId: event.data.streamId,
            title: event.data.title,
            userId: event.data.userId,
        });
    }

    /**
     * Processa stream finalizada
     */
    private async handleStreamEnded(event: StreamEvent): Promise<void> {
        // TODO: Atualizar status da stream no DynamoDB
        // TODO: Salvar métricas finais
        // TODO: Arquivar dados da stream

        this.logger.log("Stream ended processed", {
            streamId: event.data.streamId,
            userId: event.data.userId,
        });
    }

    /**
     * Processa stream atualizada
     */
    private async handleStreamUpdated(event: StreamEvent): Promise<void> {
        // TODO: Atualizar dados da stream no DynamoDB
        // TODO: Invalidar cache se existir

        this.logger.log("Stream updated processed", {
            streamId: event.data.streamId,
            title: event.data.title,
        });
    }

    /**
     * Processa viewer entrando na stream
     */
    private async handleViewerJoined(event: StreamEvent): Promise<void> {
        // TODO: Incrementar contador de viewers
        // TODO: Atualizar métricas em tempo real

        this.logger.log("Viewer joined processed", {
            streamId: event.data.streamId,
            viewerCount: event.data.viewerCount,
        });
    }

    /**
     * Processa viewer saindo da stream
     */
    private async handleViewerLeft(event: StreamEvent): Promise<void> {
        // TODO: Decrementar contador de viewers
        // TODO: Atualizar métricas em tempo real

        this.logger.log("Viewer left processed", {
            streamId: event.data.streamId,
            viewerCount: event.data.viewerCount,
        });
    }
}