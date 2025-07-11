import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../redux/index'; // Importa o store do Redux
import {
    RegisterRequest, LoginRequest, PasswordResetRequest, PasswordResetConfirmRequest,
    PerfilUpdateRequest, ConteudoRequest, ProvaRequest, AvaliacaoRequest,
    PerfilResponse, ConteudoResponse, ProvaResponse, AvaliacaoResponse
} from '../utils/Objects';
export const API_BASE_URL = process.env.EXPO_PUBLIC_REACT_NATIVE_API_URL || 'http://10.0.2.2:8000';
// Configuração da instância do Axios
const api: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 10000,
    // Não defina Content-Type globalmente! O Axios irá setar corretamente para FormData ou JSON.
});
// Interceptor para adicionar o token JWT nas requisições autenticadas
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth?.accessToken; // Ajuste conforme sua estrutura de Redux
        if (token && !['/login/', '/register/', '/password-reset/', '/password-reset/confirm/'].includes(config.url || '')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error));

export const APILayzaAuth = {
    register: async (data: RegisterRequest): Promise<AxiosResponse<any>> => {
        try {
            return await api.post('/register/', data);
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.detail || error.response?.data?.email?.[0] || 'Erro ao registrar usuário');
        }
    },
    login: async (data: LoginRequest): Promise<AxiosResponse<{ access: string; refresh: string }>> => {
        try {
            return await api.post('/login/', data);
        } catch (error: any) {
            const data = error.response.data;
            const firstErrorField = Object.keys(data)[0];
            throw new Error(data[firstErrorField][0] || 'Erro ao fazer login');
        }
    },
    passwordResetRequest: async (data: PasswordResetRequest): Promise<AxiosResponse<any>> => {
        try {
            return await api.post('/password-reset/', data);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || error.response?.data?.email?.[0] || 'Erro ao solicitar redefinição de senha');
        }
    },
    passwordResetConfirm: async (data: PasswordResetConfirmRequest): Promise<AxiosResponse<any>> => {
        try {
            return await api.post('/password-reset/confirm/', data);
        } catch (error: any) {
            const data = error.response.data;
            const firstErrorField = Object.keys(data)[0];
            throw new Error(data[firstErrorField] || 'Erro ao confirmar redefinição de senha');
        }
    },
    verifyCode: async ({code, email}: {code: string, email: string}): Promise<AxiosResponse<any>> => {
        try {
            return await api.post('/password-reset/verify-code/', { code, email });
        } catch (error: any) {
            const data = error.response.data;
            const firstErrorField = Object.keys(data)[0];
            throw new Error(data[firstErrorField] || 'Erro ao confirmar redefinição de senha');
        }
    },
    getPerfil: async (): Promise<AxiosResponse<PerfilResponse>> => {
        try {
            return await api.get('/perfil/');
        } catch (error: any) {
            throw new Error('Erro ao buscar perfil do usuário');
        }
    }
};

export const APILayzaPerfil = {
    getPerfil: async (): Promise<AxiosResponse<PerfilResponse>> => {
        try {
            return await api.get('/perfil/');
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao obter perfil');
        }
    },
    updatePerfil: async (data: any) => {
        const token = store.getState().auth?.accessToken;
        const response = await fetch(`${API_BASE_URL}/api/perfil/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: data,
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || 'Erro ao atualizar perfil');
        }
        return await response.json();
    },
    deletePerfil: async (): Promise<AxiosResponse<any>> => {
        try {
            return await api.delete('/perfil/delete/');
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao deletar perfil');
        }
    }
}

export const APILayzaConteudos = {
    getConteudos: async (): Promise<AxiosResponse<ConteudoResponse[]>> => {
        try {
            return await api.get('/conteudos/');
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao listar conteúdos');
        }
    },
    createConteudo: async (data: ConteudoRequest): Promise<AxiosResponse<ConteudoResponse>> => {
        try {
            return await api.post('/conteudos/create/', data);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao criar conteúdo');
        }
    },
    getConteudo: async (id: number): Promise<AxiosResponse<ConteudoResponse>> => {
        try {
            return await api.get(`/conteudos/${id}/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao obter conteúdo');
        }
    },
    updateConteudo: async (id: number, data: ConteudoRequest): Promise<AxiosResponse<ConteudoResponse>> => {
        try {
            return await api.put(`/conteudos/${id}/update/`, data);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao atualizar conteúdo');
        }
    },
    deleteConteudo: async (id: number): Promise<AxiosResponse<any>> => {
        try {
            return await api.delete(`/conteudos/${id}/delete/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao deletar conteúdo');
        }
    }
}

export const APILayzaProvas = {
    getProvas: async (): Promise<AxiosResponse<ProvaResponse[]>> => {
        try {
            return await api.get('/provas/');
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao listar provas');
        }
    },
    createProva: async (data: ProvaRequest): Promise<AxiosResponse<ProvaResponse>> => {
        try {
            const formData = new FormData();
            formData.append('titulo', data.titulo);
            formData.append('data', data.data);
            if (data.foto) {
                formData.append('foto', {
                    uri: data.foto,
                    type: 'image/jpeg',
                    name: 'prova.jpg',
                } as any);
            }
            if (data.descricao) {
                formData.append('descricao', data.descricao);
            }
            return await api.post('/provas/create/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao criar prova');
        }
    },
    getProva: async (id: number): Promise<AxiosResponse<ProvaResponse>> => {
        try {
            return await api.get(`/provas/${id}/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao obter prova');
        }
    },
    updateProva: async (id: number, data: ProvaRequest): Promise<AxiosResponse<ProvaResponse>> => {
        try {
            const formData = new FormData();
            formData.append('titulo', data.titulo);
            formData.append('data', data.data);
            if (data.foto) {
                formData.append('foto', {
                    uri: data.foto,
                    type: 'image/jpeg',
                    name: 'prova.jpg',
                } as any);
            }
            if (data.descricao) {
                formData.append('descricao', data.descricao);
            }
            return await api.put(`/provas/${id}/update/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao atualizar prova');
        }
    },
    deleteProva: async (id: number): Promise<AxiosResponse<any>> => {
        try {
            return await api.delete(`/provas/${id}/delete/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao deletar prova');
        }
    }
}

export const APILayzaAvaliacao = {
    getAvaliacoes: async (): Promise<AxiosResponse<AvaliacaoResponse[]>> => {
        try {
            return await api.get('/avaliacoes/');
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao listar avaliações');
        }
    },
    createAvaliacao: async (data: AvaliacaoRequest): Promise<AxiosResponse<AvaliacaoResponse>> => {
        try {
            return await api.post('/avaliacoes/create/', data);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao criar avaliação');
        }
    },
    getAvaliacao: async (id: number): Promise<AxiosResponse<AvaliacaoResponse>> => {
        try {
            return await api.get(`/avaliacoes/${id}/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao obter avaliação');
        }
    },
    updateAvaliacao: async (id: number, data: AvaliacaoRequest): Promise<AxiosResponse<AvaliacaoResponse>> => {
        try {
            return await api.put(`/avaliacoes/${id}/update/`, data);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao atualizar avaliação');
        }
    },
    deleteAvaliacao: async (id: number): Promise<AxiosResponse<any>> => {
        try {
            return await api.delete(`/avaliacoes/${id}/delete/`);
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Erro ao deletar avaliação');
        }
    }
}

export default api;