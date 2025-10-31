import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonItem, IonList, IonButton, IonIcon,
    IonCard, IonCardContent, IonBadge, IonInput, IonSelect, IonSelectOption,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, refreshOutline, chevronForwardOutline, calendarOutline } from 'ionicons/icons';
import { OrdersService } from 'src/app/core/services/orders.service';
import { AdminOrder } from 'src/app/core/types/AdminOrder.types';
import { PedidoDetailsModal } from '../../shared/pedidos-details/pedido-details.modal';
import { AssignRepartidorModal } from './assign-repartidor/assign-repartidor.modal';

@Component({
    standalone: true,
    selector: 'app-admin-pedidos',
    imports: [
        CommonModule, FormsModule, 
        IonButton, IonIcon, IonItem, IonList,
        IonCard, IonCardContent, IonBadge, IonInput, IonSelect, IonSelectOption,
    ],
    templateUrl: './pedidos.page.html',
    styleUrls: ['./pedidos.page.scss'],
    providers:[ModalController]
})
export class PedidosPage {
    // Filtros
    q = '';
    estado = '';
    pago_estado = '';
    fdesde = '';
    fhasta = '';

    // Data
    rows: AdminOrder[] = [];
    limit = 20;
    offset = 0;
    hasMore = true;
    loading = false;
    debounce?: any;

    estadosAll = [
        { value: 'PENDIENTE',    label: 'Pendiente' },
        { value: 'ASIGNADO',     label: 'Asignado' },
        { value: 'EN_REPARTO',   label: 'En reparto' },
        { value: 'ENTREGADO',    label: 'Entregado' },
        { value: 'NO_ENTREGADO', label: 'No entregado' },
        { value: 'CANCELADO',    label: 'Cancelado' },
    ];
    estadosSel: string[] = []; 

    constructor(
        private api: OrdersService,
        private toast: ToastController,
        private modalCtrl: ModalController
    ) {
        addIcons({ searchOutline, refreshOutline, chevronForwardOutline, calendarOutline });
    }

    ionViewDidEnter() { this.reload(); }

    applyFilters() {
        this.estado = (this.estadosSel && this.estadosSel.length) ? this.estadosSel.join(',') : '';
        this.reload();
    }

    onEstadosChange(ev: any) {
        this.estadosSel = ev.detail?.value || [];
        this.applyFilters();
    }
    removeEstado(v: string) {
        this.estadosSel = this.estadosSel.filter(x => x !== v);
        this.applyFilters();
    }
    clearEstados() {
        this.estadosSel = [];
        this.applyFilters();
    }

    // buscador con debounce
    onFilterTyping() {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => this.applyFilters(), 400);
    }
    clearSearch() {
        this.q = '';
        this.applyFilters();
    }


    // ===== Data =====
    async reload() {
        this.rows = [];
        this.offset = 0;
        this.hasMore = true;
        await this.fetch();
    }

    async fetch() {
        if (this.loading || !this.hasMore) return;
        this.loading = true;

        this.api.list({
        q: this.q,
        estado: this.estado,
        pago_estado: this.pago_estado,
        fdesde: this.fdesde,
        fhasta: this.fhasta,
        limit: this.limit,
        offset: this.offset
        }).subscribe({
        next: (data :any)  => {
            this.rows = [...this.rows, ...data];
            this.offset += data.length;
            this.hasMore = data.length === this.limit;
            this.loading = false;
        },
        error: async () => {
            this.loading = false;
            (await this.toast.create({ message: 'Error cargando pedidos', duration: 1500, color: 'danger' })).present();
        }
        });
    }

    // Helpers
    money(n: number, cur = 'USD') {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: cur || 'USD' }).format(Number(n || 0));
    }
    badgeColorEstado(e: string) {
        switch (e) {
        case 'PENDIENTE': return 'warning';
        case 'ASIGNADO': return 'tertiary';
        case 'EN_REPARTO': return 'medium';
        case 'ENTREGADO': return 'success';
        case 'NO_ENTREGADO': return 'dark';
        case 'CANCELADO': return 'danger';
        default: return 'medium';
        }
    }

    dateRange: { start?: string; end?: string } | null = null; // mantiene el valor del ion-datetime
    onRangeChange(ev: any) {
        const val = ev.detail?.value || {};
        // formatea a YYYY-MM-DD para el backend
        this.fdesde = val.start ? String(val.start).slice(0,10) : '';
        this.fhasta = val.end   ? String(val.end).slice(0,10)   : '';
        this.applyFilters();
    }

    async openDetail(o: any) {
        const modal = await this.modalCtrl.create({
            component: PedidoDetailsModal,
            componentProps: { orderId: o.id ,isAdmin : true },
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.9
        });
        await modal.present();
    }

    async openAssign(o: any) {
        const modal = await this.modalCtrl.create({
            component: AssignRepartidorModal,
            componentProps: { pedidoId: o.id },
            breakpoints: [0, 0.7, 1],
            initialBreakpoint: 0.9
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role !== 'ok' || !data) return;

        this.api.assignOrder(o.id, data).subscribe({
            next: async () => {
                (await this.toast.create({ message: 'Repartidor asignado', duration: 1200, color: 'success' })).present();
                this.reload();
            },
            error: async (err) => {
            const msg = err?.error?.message || 'No se pudo asignar';
            (await this.toast.create({ message: msg, duration: 1600, color: 'danger' })).present();
            }
        });
    }

}
