export interface AdminUser {
    id: number;
    nombre_completo: string;
    correo: string;
    telefono: string | null;
    estado: 'ACTIVE' | 'BLOCKED';
    rol: string;
    created_at: string;
    updated_at: string;
}