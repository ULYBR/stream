import apiClient from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface AuthResponse {
    token: string;
    expiresIn: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        createdAt: string;
    };
}

export const authService = {
    // Login do usuário
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', data);
        return response.data;
    },

    // Registro de novo usuário
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    },

    // Salvar dados de autenticação no localStorage
    saveAuthData(authData: AuthResponse) {
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('user_data', JSON.stringify(authData.user));
    },

    // Obter dados do usuário do localStorage
    getUserData() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    // Verificar se está logado
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    },

    // Logout
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    },
};