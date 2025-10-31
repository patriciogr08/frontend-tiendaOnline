import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonSegment, IonSegmentButton, IonLabel,
    IonList, IonItem, IonBadge, IonButton, IonIcon, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { playOutline, checkboxOutline, cashOutline } from 'ionicons/icons';
import { CourierOrdersService } from 'src/app/core/services/courier.service';
import { CompletePaymentModal } from './complete-payment/complete-payment.modal';

@Component({
    standalone: true,
    selector: 'app-courier-orders',
    templateUrl: './courier-orders.page.html',
    styleUrls: ['./courier-orders.page.scss'],
    imports: [
        CommonModule, IonContent, IonInfiniteScroll,IonInfiniteScrollContent,
        IonSegment, IonSegmentButton, IonLabel,
        IonList, IonItem, IonBadge, IonButton, IonIcon,
        IonRefresher, IonRefresherContent
    ],
    providers:[ModalController]
})
export class CourierOrdersPage {
    tab: 'ASIGNADO' | 'EN_REPARTO' | 'COMPLETADOS' = 'ASIGNADO';
    rows: any[] = [];
    loading = false;
    limit = 20; offset = 0; hasMore = true;

    constructor(
        private api: CourierOrdersService,
        private modalCtrl: ModalController,
        private toast: ToastController
    ) { addIcons({ playOutline, checkboxOutline, cashOutline }); }

    ionViewWillEnter() { this.reload(); }

    money(n: number, cur = 'USD') { return new Intl.NumberFormat('es-EC',{style:'currency',currency:cur}).format(Number(n||0)); }
    badgeColorEstado(e: string) {
        switch (e) {
        case 'ASIGNADO': return 'tertiary';
        case 'EN_REPARTO': return 'medium';
        case 'ENTREGADO': return 'success';
        case 'PAGADO': return 'success';
        default: return 'medium';
        }
    }

    async changeTab(ev: any) {
        this.tab = ev.detail?.value || this.tab;
        this.reload();
    }

    async reload(event?: any) {
        this.loading = true; this.offset = 0; this.hasMore = true;

        const estadoParam =
        this.tab === 'COMPLETADOS' ? 'ENTREGADO,PAGADO' : this.tab;

        this.api.list(estadoParam as string, this.limit, this.offset).subscribe({
        next: rs => { this.rows = rs; this.loading = false; event?.target?.complete(); this.hasMore = rs.length === this.limit; },
        error: _ => { this.loading = false; event?.target?.complete(); }
        });
    }

    fetchMore(event: any) {
        const estadoParam =
        this.tab === 'COMPLETADOS' ? 'ENTREGADO,PAGADO' : this.tab;

        this.offset += this.limit;
        this.api.list(estadoParam as string, this.limit, this.offset).subscribe({
        next: rs => { this.rows = this.rows.concat(rs); this.hasMore = rs.length === this.limit; event.target.complete(); },
        error: _ => event.target.complete()
        });
    }

    start(o: any) {
        this.api.startDelivery(o.id).subscribe({
        next: async () => { (await this.toast.create({ message:'En reparto', duration:1200, color:'success' })).present(); this.reload(); },
        error: async (err) => { (await this.toast.create({ message: err?.error?.message || 'No se pudo iniciar', duration:1500, color:'danger' })).present(); }
        });
    }

    async complete(o: any) {
        const modal = await this.modalCtrl.create({
        component: CompletePaymentModal,
        componentProps: { pedidoId: o.id, total: o.total },
        breakpoints: [0, .9, 1], initialBreakpoint: .9
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role !== 'ok' || !data) return;

        this.api.completeWithPayment(o.id, data).subscribe({
        next: async () => { (await this.toast.create({ message:'Pago registrado', duration:1400, color:'success' })).present(); this.reload(); },
        error: async (err) => { (await this.toast.create({ message: err?.error?.message || 'No se pudo completar', duration:1600, color:'danger' })).present(); }
        });
    }

    
}
