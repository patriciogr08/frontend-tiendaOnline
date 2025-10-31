export interface AdminOrder {
    id: number;
    numero: string;
    usuario_id: number;
    estado: 'PENDIENTE'|'ASIGNADO'|'EN_REPARTO'|'ENTREGADO'|'NO_ENTREGADO'|'CANCLADO';
    moneda: string;
    subtotal: number;
    descuento: number;
    envio: number;
    impuesto: number;
    total: number;
    created_at: string;
    updated_at: string;
    cliente_nombre: string;
    cliente_correo: string;
    cliente_telefono: string | null;
    pago_estado?: 'PENDIENTE'|'PAGADO'|'FALLIDO'|null;
    pago_metodo?: string | null;
    pago_monto?: number | null;
}