import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddressDTO } from '../types/address.type';

@Injectable({ providedIn: 'root' })
export class AddressesService {
    private base = '/me/addresses';

    constructor(private http: HttpClient) {}

    list() {
        return this.http.get<AddressDTO[]>(this.base);
    }

    create(dto: AddressDTO) {
        const payload: AddressDTO = {
            ...dto,
            linea2: dto.linea2 ?? null,
            codigo_postal: dto.codigo_postal ?? null,
            telefono: dto.telefono ?? null,
            es_predeterminada: !!dto.es_predeterminada
        };
        return this.http.post<AddressDTO>(this.base, payload);
    }

    update(id: number, dto: AddressDTO) {
        const payload: AddressDTO = {
        ...dto,
        linea2: dto.linea2 ?? null,
        codigo_postal: dto.codigo_postal ?? null,
        telefono: dto.telefono ?? null,
        es_predeterminada: !!dto.es_predeterminada
        };
        return this.http.put<AddressDTO>(`${this.base}/${id}`, payload);
    }

    setDefault(id: number) {
        return this.http.put<AddressDTO>(`${this.base}/${id}/default`, {});
    }

    remove(id: number) {
        return this.http.delete<{ message: string }>(`${this.base}/${id}`);
    }
}
