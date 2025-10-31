import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourierOrdersService {
    constructor(private http: HttpClient) {}

    list(estado: string, limit = 20, offset = 0) {
        let params = new HttpParams().set('limit', limit).set('offset', offset);
        if (estado) params = params.set('estado', estado);
        return this.http.get<any[]>('/courier/pedidos', { params });
    }

    startDelivery(pedidoId: number) {
        return this.http.post(`/courier/pedidos/${pedidoId}/start`, {});
    }

    completeWithPayment(pedidoId: number, payload: { metodo: 'EFECTIVO'|'TRANSFERENCIA'; monto: number; file: File }) {
        const fd = new FormData();
        fd.append('metodo', payload.metodo);
        fd.append('monto', String(payload.monto));
        fd.append('comprobante', payload.file); // campo: comprobante
        return this.http.post(`/courier/pedidos/${pedidoId}/complete`, fd);
    }
}
