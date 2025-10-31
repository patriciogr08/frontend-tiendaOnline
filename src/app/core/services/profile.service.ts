// src/app/core/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(private http: HttpClient) {}
    // Leer perfil: usar /auth/me (ya lo tienes también en AuthService.me)
    getMe() { return this.http.get<any>('/auth/me'); }
    // Editar perfil
    putMe(dto: { nombre_completo: string; telefono: string | null }) {
        return this.http.put<any>('/me', dto);
    }
    // Cambiar contraseña
    putPassword(dto: { contrasena_actual: string; contrasena_nueva: string }) {
        return this.http.put<any>('/me/password', dto);
    }

    uploadAvatar(file: File) {
        const form = new FormData();
        form.append('avatar', file);
        return this.http.post<any>('/me/avatar', form);
    }
}
