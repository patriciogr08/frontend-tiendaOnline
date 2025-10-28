// src/app/core/interceptors/api-base-url.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // No tocar si ya es absoluta
  if (/^https?:\/\//i.test(req.url)) return next(req);

  const url = `${environment.apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;

  // Añadimos Authorization si hay token
  const token = localStorage.getItem('accessToken'); // o Capacitor Preferences si prefieres
  const authReq = token
    ? req.clone({ url, setHeaders: { Authorization: `Bearer ${token}` } })
    : req.clone({ url });

  return next(authReq);
};
