export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    email: string;
    code: string;
    new_password: string;
}

export interface PerfilUpdateRequest {
    email?: string;
    username?: string;
    pref_visual?: boolean;
    pref_auditivo?: boolean;
    pref_leitura_escrita?: boolean;
    serie_atual?: string;
    foto_perfil?: File;
}

export interface ConteudoRequest {
    titulo: string;
    tipo: 'Vídeo' | 'Texto' | 'Áudio';
    tema: 'Matemática' | 'Português' | 'História' | 'Geografia' | 'Inglês';
    url: string;
    duracao_estimada?: number;
}

export interface ProvaRequest {
    titulo: string;
    data: string; // Formato ISO 8601, e.g., "2025-05-19"
    foto?: string; // URI para upload via FormData
    descricao?: string;
}

export interface AvaliacaoRequest {
    conteudo_id: number;
    nota?: string;
    comentario?: string;
}

export interface PerfilResponse {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    pref_visual: boolean;
    pref_auditivo: boolean;
    pref_leitura_escrita: boolean;
    serie_atual: string;
    foto_perfil?: string;
}

export interface ConteudoResponse {
    id: number;
    titulo: string;
    tipo: 'Vídeo' | 'Texto' | 'Áudio';
    tema: 'Matemática' | 'Português' | 'História' | 'Geografia' | 'Inglês';
    url: string;
    duracao_estimada?: number;
    data_criacao: string;
}

export interface ProvaResponse {
    id: number;
    titulo: string;
    data: string;
    foto?: string; // URL da imagem
    descricao?: string;
    criado_em: string;
}

export interface AvaliacaoResponse {
    id: number;
    user: PerfilResponse;
    conteudo: ConteudoResponse;
    nota?: string;
    comentario?: string;
    data_avaliacao: string;
}