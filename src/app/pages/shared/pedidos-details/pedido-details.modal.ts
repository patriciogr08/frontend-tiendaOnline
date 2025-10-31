import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonLabel, IonBadge
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
    standalone: true,
    selector: 'app-pedido-details-modal',
    templateUrl: './pedido-details.modal.html',
    styleUrls: ['./pedido-details.modal.scss'],
    imports: [
        CommonModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
        IonContent, IonList, IonItem, IonLabel, IonBadge
    ]
})
export class PedidoDetailsModal implements OnInit {
    @Input() orderId!: number;

    data: any;
    loading = true;

    constructor(
        private modalCtrl: ModalController, 
        private api: OrdersService
    ) {
        addIcons({ closeOutline });
    }

    ngOnInit(): void {
        this.api.getById(this.orderId).subscribe({
            next: d => { this.data = d; this.loading = false; },
            error: _ => { this.loading = false; }
        });
    }

    money(n: number, cur = 'USD') {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: cur }).format(Number(n || 0));
    }
    badgeEstado(e: string) {
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
    badgePago(e?: string|null) {
        switch (e) {
        case 'PAGADO': return 'success';
        case 'FALLIDO': return 'danger';
        case 'PENDIENTE': return 'warning';
        default: return 'medium';
        }
    }

    close() { this.modalCtrl.dismiss(); }
}
