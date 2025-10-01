import apiClient from './api';

export interface Stream {
    id: string;
    title: string;
    description: string;
    status: 'live' | 'offline' | 'scheduled';
    userId: string;
    userName: string;
    userAvatar?: string;
    thumbnailUrl?: string;
    streamUrl?: string;
    viewerCount: number;
    tags?: string[];
    category?: string;
    startedAt?: string;
    scheduledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStreamData {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    tags?: string[];
    category?: string;
    status?: 'live' | 'offline' | 'scheduled';
}

export const streamsService = {
    // Obter todas as streams
    async getAllStreams(): Promise<Stream[]> {
        const response = await apiClient.get('/api/streams');
        return response.data;
    },

    // Obter stream por ID
    async getStreamById(id: string): Promise<Stream> {
        const response = await apiClient.get(`/api/streams/${id}`);
        return response.data;
    },

    // Criar nova stream
    async createStream(data: CreateStreamData): Promise<Stream> {
        const response = await apiClient.post('/api/streams', data);
        return response.data;
    },
};