import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonImg, IonFooter,
  IonToolbar, IonTitle, IonSpinner
} from '@ionic/angular/standalone';
import { CartService } from '../../../core/services/cart.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, removeOutline, cartOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  imports: [
    CommonModule, CurrencyPipe,
    IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonImg,
    IonFooter, IonToolbar, IonSpinner
  ]
})
export class CartPage implements OnInit {
  loading = false;

  constructor(
    public cart: CartService,
    private toast: ToastController,
    private alert: AlertController,
    private loadingC: LoadingController,

  ) { addIcons({ trashOutline, addOutline, removeOutline, cartOutline }); }

  ngOnInit() { this.refresh(); }

  refresh() {
    this.loading = true;
    this.cart.load().pipe(finalize(() => this.loading = false)).subscribe({});
  }

  inc(item: any) {
    this.cart.update(item.id, item.cantidad + 1).subscribe();
  }

  dec(item: any) {
    if (item.cantidad > 1) {
      this.cart.update(item.id, item.cantidad - 1).subscribe();
    }
  }

  remove(item: any) {
    this.cart.remove(item.id).subscribe();
  }

  async clear() {
    const a = await this.alert.create({
      header: 'Vaciar carrito',
      message: '¿Deseas eliminar todos los productos?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Vaciar', role: 'destructive', handler: () => this.cart.clear().subscribe() }
      ]
    });
    await a.present();
  }

  private money(n: number) {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n || 0);
  }

  async doCheckout() {
    const state = this.cart.state();
    if (!state.items.length) {
      (await this.toast.create({ message:'Tu carrito está vacío', duration:1200, color:'warning' })).present();
      return;
    }

    const total = state.total;
    const count = state.items.reduce((a, it) => a + (it.cantidad || 1), 0);

    const alert = await this.alert.create({
      header: 'Confirmar compra',
      message: `Vas a comprar ${count} ${count === 1 ? 'artículo' : 'artículos'} por ${this.money(total)}.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, comprar',
          handler: async () => {
            const loader = await this.loadingC.create({ message: 'Procesando pedido...' });
            await loader.present();

            this.cart.checkout().subscribe({
              next: async (r:any) => {
                const label = r?.numero ? `Pedido ${r.numero}` : `Pedido #${r.pedido_id}`;
                (await this.toast.create({ message:`Generado: ${label}`, duration:1500, color:'success' })).present();
                this.cart.clear().subscribe();
                await loader.dismiss();
              },
              error: async () => {
                await loader.dismiss();
                (await this.toast.create({ message:'No se pudo procesar', duration:1500, color:'danger' })).present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
