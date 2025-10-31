export interface AddressDTO {
    id?: number;
    tipo: 'SHIPPING' | 'BILLING';
    destinatario: string;
    linea1: string;
    linea2: string | null;
    ciudad: string;
    provincia: string;
    codigo_postal: string | null;
    pais_codigo: string;
    telefono: string | null;
    es_predeterminada: boolean | 0 | 1;
}
