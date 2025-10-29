import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartState } from '../types/cartState.types';

@Injectable({ providedIn: 'root' })
export class CartService {
    state = signal<CartState>({ cart: null, items: [], total: 0 });

    constructor(private http: HttpClient) {}

    load() {
        return this.http.get<CartState>('/cart').subscribe(s => this.state.set(s));
    }

    add(producto_id: number, cantidad = 1) {
        return this.http.post<CartState>('/cart/items', { producto_id, cantidad }).subscribe(s => this.state.set(s));
    }

    update(itemId: number, cantidad: number) {
        return this.http.put<CartState>(`/cart/items/${itemId}`, { cantidad }).subscribe(s => this.state.set(s));
    }

    remove(itemId: number) {
        return this.http.delete<CartState>(`/cart/items/${itemId}`).subscribe(s => this.state.set(s));
    }

    clear() {
        return this.http.post<CartState>('/cart/clear', {}).subscribe(s => this.state.set(s));
    }

    checkout() {
        return this.http.post<{ok:boolean; cart_id:number}>('/cart/checkout', {});
    }

    count() { return this.state().items.reduce((a,b)=>a + Number(b.cantidad||0), 0); }

    finalPrice(p:any) {
        // para UI (ya lo calcula backend por item)
        const precio = Number(p.precio || 0);
        if (!p?.tiene_descuento) return precio;
        if (p.porcentaje) return +(precio * (1 - Number(p.porcentaje)/100)).toFixed(2);
        if (p.descuento)  return +(precio - Number(p.descuento)).toFixed(2);
        return precio;
    }
}
