import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonBadge, IonItem, IonList } from '@ionic/angular/standalone';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ModalController, ToastController } from '@ionic/angular';
import { chevronForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AdminOrder } from 'src/app/core/types/AdminOrder.types';
import { PedidoDetailsModal } from '../../shared/pedidos-details/pedido-details.modal';

@Component({
  standalone: true,
  selector: 'app-client-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  imports: [
    CommonModule,
    IonButton, IonItem, IonList,IonBadge
  ],
  providers:[ModalController]
})
export class OrdersPage {
      // Data
      rows: AdminOrder[] = [];
      limit = 20;
      offset = 0;
      hasMore = true;
      loading = false;
      debounce?: any;
  
      constructor(
          private api: OrdersService,
          private toast: ToastController,
          private modalCtrl: ModalController
      ) {
          addIcons({ chevronForwardOutline });
      }

      ionViewDidEnter() { this.reload(); }

  
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
  
          this.api.getOrderMe({
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
              (await this.toast.create({ message: 'Error cargando pedidos del usuario', duration: 1500, color: 'danger' })).present();
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
  
      async openDetail(o: any) {
          const modal = await this.modalCtrl.create({
              component: PedidoDetailsModal,
              componentProps: { orderId: o.id },
              breakpoints: [0, 0.75, 1],
              initialBreakpoint: 0.9
          });
          await modal.present();
      }
}
