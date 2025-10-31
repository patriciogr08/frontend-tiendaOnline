import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartState } from '../types/cartState.types';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
    private base = '/cart';
    state = signal<CartState>({ cart: null, items: [], total: 0 });
    count = computed(() => this.state().items.reduce((a, b) => a + Number(b.cantidad || 0), 0));


    constructor(private http: HttpClient) {}

    load() {
        return this.http.get<CartState>(`${this.base}`)
        .pipe(tap(s => this.state.set(s)));
    }

    add(producto_id: number, cantidad = 1) {
        return this.http.post<CartState>(`${this.base}/items`, { producto_id, cantidad })
        .pipe(tap(s => this.state.set(s)));
    }

    update(itemId: number, cantidad: number) {
        return this.http.put<CartState>(`${this.base}/items/${itemId}`, { cantidad })
        .pipe(tap(s => this.state.set(s)));
    }

    remove(itemId: number) {
        return this.http.delete<CartState>(`${this.base}/items/${itemId}`)
        .pipe(tap(s => this.state.set(s)));
    }

    clear() {
        return this.http.delete<CartState>(`${this.base}/clear`)
        .pipe(tap(s => this.state.set(s)));
    }

    checkout() {
        return this.http.post<any>(`${this.base}/checkout`, {});
    }

}
