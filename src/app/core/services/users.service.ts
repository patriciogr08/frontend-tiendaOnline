// src/app/core/services/admin-users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../types/auth.types';
import { AdminUser } from '../types/AdminUser.types';

@Injectable({ providedIn: 'root' })
export class UsersService {
    constructor(private http: HttpClient) {}

    list(opts: { q?: string; estado?: 'ACTIVE'|'BLOCKED'|''; limit?: number; offset?: number } = {}) {
        let params = new HttpParams();
        if (opts.q) params = params.set('q', opts.q);
        if (opts.estado) params = params.set('estado', opts.estado);
        if (opts.limit != null) params = params.set('limit', String(opts.limit));
        if (opts.offset != null) params = params.set('offset', String(opts.offset));
        return this.http.get<AdminUser[]>('/admin/users', { params });
    }

    // Crear REPARTIDOR
    createRepartidor(dto: { nombre_completo: string; correo: string; telefono?: string|null; contrasena: string; }) {
        return this.http.post<AdminUser>('/admin/users', dto);
    }

    setStatus(id: number, estado: 'ACTIVE'|'BLOCKED') {
        return this.http.put<AdminUser>(`/admin/users/${id}/status`, { estado });
    }

    updateBasic(id: number, dto: { nombre_completo: string; telefono?: string|null }) {
        return this.http.put<AdminUser>(`/admin/users/${id}`, dto);
    }
}
