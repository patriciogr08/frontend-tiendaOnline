import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdminOrder } from '../types/AdminOrder.types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(private http: HttpClient) {}

    list(opts: {
        q?: string; estado?: string; pago_estado?: string;
        fdesde?: string; fhasta?: string; limit?: number; offset?: number;
    }) {
        let params = new HttpParams();
        Object.entries(opts || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
        });
        return this.http.get<AdminOrder[]>('/orders/admin', { params });
    }

    getById(id: number) {
        return this.http.get(`/orders/${id}`);
    }

    
    getOrderMe( opts :{limit?: number; offset?: number; }) {
        let params = new HttpParams();
        Object.entries(opts || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null ) params = params.set(k, String(v));
        });
        return this.http.get<AdminOrder[]>('/orders/list/me', { params });
    }

    listCouriers(q?: string) {
        const params: any = {};
        if (q) params.q = q;
        return this.http.get<any[]>('/orders/admin/repartidores', { params });
    }
    assignOrder(pedidoId: number, payload: { repartidor_usuario_id: number; notas?: string }) {
        return this.http.post(`/orders/admin/${pedidoId}/assign`, payload);
    }
}
