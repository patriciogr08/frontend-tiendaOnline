export interface CartState {
    cart: any | null;
    items: Array<{
        id:number; producto_id:number; nombre:string; foto_url?:string;
        cantidad:number; precio_unitario:number; descuento:number; total:number;
    }>;
    total: number;
}