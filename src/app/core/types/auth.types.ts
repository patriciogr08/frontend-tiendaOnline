export interface User {
    id: number;
    nombre_completo: string;
    correo: string;
    rol?: 'ADMIN' | 'CLIENTE' | 'REPARTIDOR';
}

export interface LoginDto { 
    correo: string; 
    password: string; 
}

export interface RegisterDto { 
    nombre: string; 
    correo: string; 
    password: string; 
}

export interface ForgotDto { 
    correo: string; 
}

export interface ResetDto { 
    token: string; 
    password: string; 
}
