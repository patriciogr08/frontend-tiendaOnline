import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductsService {
    constructor(private http: HttpClient) {}

    meta() { return this.http.get<any>('/products/meta'); }

    list(opts?: { q?: string; limit?: number; offset?: number ; tipo?: number | null; publicado?: number | null}) {
        let params = new HttpParams();
        if (opts?.q)                params = params.set('q', opts.q);
        if (opts?.limit)            params = params.set('limit', opts.limit);
        if (opts?.offset)           params = params.set('offset', opts.offset);
        if (opts?.tipo!=null)       params = params.set('tipo', String(opts.tipo));
        if (opts?.publicado!=null)  params = params.set('publicado', String(opts.publicado));
        return this.http.get<any[]>('/products', { params });
    }

    get(id: number) { return this.http.get<any>(`/products/${id}`); }

    create(form: any, file?: File) {
        const fd = new FormData();
        for (const [k, v] of Object.entries(form)) if (v != null) fd.append(k, String(v));
        if (file) fd.append('foto', file);
        return this.http.post<any>('/products', fd);
    }

    update(id: number, form: any, file?: File) {
        const fd = new FormData();
        for (const [k, v] of Object.entries(form)) if (v != null) fd.append(k, String(v));
        if (file) fd.append('foto', file);
        return this.http.put<any>(`/products/${id}`, fd);
    }

    remove(id: number) { return this.http.delete(`/products/${id}`); }
}
