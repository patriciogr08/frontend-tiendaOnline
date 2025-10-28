// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private key = 'accessToken';
    private userKey = 'user';

    constructor(private http: HttpClient) {}

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
        // opcional: avisar backend (no-op)
        return this.http.post('/auth/logout', {});
    }

    isAuthenticated() { return !!localStorage.getItem(this.key); }
    currentUser() {
        const raw = localStorage.getItem(this.userKey);
        return raw ? JSON.parse(raw) : null;
    }
}
