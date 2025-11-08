import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private key = 'accessToken';
    private userKey = 'user';

    constructor(private http: HttpClient) {}

    register(dto: {
        correo: string;
        contrasena: string;
        nombre_completo: string;
        telefono?: string | null;
        direccion?: {
        tipo: 'SHIPPING'|'BILLING';
        destinatario: string;
        linea1: string; linea2?: string | null;
        ciudad: string; provincia: string; codigo_postal?: string | null;
        pais_codigo: string; telefono?: string | null;
        es_predeterminada?: boolean;
        }
    }) {
        return this.http.post<any>('/auth/register', dto).pipe(
        tap(res => {
            localStorage.setItem(this.key, res.accessToken);
            localStorage.setItem(this.userKey, JSON.stringify(res.user));
        })
        );
    }

    login(dto: { correo: string; password: string }) {
        return this.http.post<any>('/auth/login', dto).pipe(
            tap(res => {
                localStorage.setItem(this.key, res.accessToken);
                localStorage.setItem(this.userKey, JSON.stringify(res.user));
            })
        );
    }

    me() {
        return this.http.get<any>('/auth/me').pipe(
        tap(user => localStorage.setItem(this.userKey, JSON.stringify(user)))
        );
    }

    logout() {
        localStorage.removeItem(this.key);
        localStorage.removeItem(this.userKey);
        return this.http.post('/auth/logout', {});
    }

    isAuthenticated() { return !!localStorage.getItem(this.key); }

    currentUser() {
        const raw = localStorage.getItem(this.userKey);
        return raw ? JSON.parse(raw) : null;
    }
}
