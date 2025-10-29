import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonImg, IonFooter,
  IonToolbar, IonTitle, IonSpinner
} from '@ionic/angular/standalone';
import { CartService } from '../../../core/services/cart.service';
import { ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, removeOutline, cartOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  imports: [
    CommonModule, CurrencyPipe,
    IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonImg,
    IonFooter, IonToolbar, IonTitle, IonSpinner
  ]
})
export class CartPage implements OnInit {
  loading = false;

  constructor(
    public cart: CartService,
    private toast: ToastController,
    private alert: AlertController
  ) { addIcons({ trashOutline, addOutline, removeOutline, cartOutline }); }

  ngOnInit() { this.refresh(); }

  refresh() {
    this.loading = true;
    this.cart.load()?.add?.(() => this.loading = false);
  }

  inc(item:any) { this.cart.update(item.id, item.cantidad + 1); }
  dec(item:any) { if (item.cantidad > 1) this.cart.update(item.id, item.cantidad - 1); }
  remove(item:any){ this.cart.remove(item.id); }

  async clear() {
    const a = await this.alert.create({ header:'Vaciar carrito', message:'¿Deseas eliminar todos los productos?', buttons:[
      { text:'Cancelar', role:'cancel' },
      { text:'Vaciar', role:'destructive', handler:()=> this.cart.clear() }
    ]});
    await a.present();
  }

  async doCheckout() {
    if (this.cart.state().items.length === 0) {
      (await this.toast.create({ message:'Tu carrito está vacío', duration:1200, color:'warning' })).present();
      return;
    }
    this.cart.checkout().subscribe({
      next: async (r) => {
        (await this.toast.create({ message:`Pedido generado #${r.cart_id}`, duration:1500, color:'success' })).present();
        this.cart.clear();
      },
      error: async () => (await this.toast.create({ message:'No se pudo procesar', duration:1500, color:'danger' })).present()
    });
  }
}
