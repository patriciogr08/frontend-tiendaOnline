export interface CartItem {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    total: number;
    nombre: string;
    foto_url?: string;
}
export interface CartState {
    cart: { id:number; usuario_id:number; estado:string; moneda:string } | null;
    items: CartItem[];
    total: number;
}
