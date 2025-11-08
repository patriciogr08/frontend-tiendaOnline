import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  IonContent, IonSearchbar, IonItem, IonSelect, IonSelectOption, IonChip, IonLabel,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent,
  IonSpinner, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { Subject, debounceTime } from 'rxjs';
import { addIcons } from 'ionicons';
import { pricetagOutline } from 'ionicons/icons';

import { ProductsService } from '../../../core/services/products.service';
import { ProductTypesService } from '../../../core/services/product-types.service';
import { ModalController, ToastController } from '@ionic/angular';
import { CartService } from '../../../core/services/cart.service';
import { QuantitySheetComponent } from '../../shared/quantity-sheet/quantity-sheet.component';

@Component({
  standalone: true,
  selector: 'app-client-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  imports: [
    CommonModule, CurrencyPipe, NgOptimizedImage,
    IonContent, IonSearchbar, IonItem, IonSelect, IonSelectOption, IonChip, IonLabel,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent,
    IonSpinner, IonIcon, IonButton
  ],
  providers: [ModalController, ToastController]
})
export class ShopPage implements OnInit {
  private toast = inject(ToastController);
  loading = false;
  items: any[] = [];
  tipos: any[] = [];

  // filtros
  q = '';
  selectedTipos: number[] = [];

  // paginación
  limit = 16;
  offset = 0;
  hasMore = true;

  private search$ = new Subject<string>();

  constructor(
    private modalCtrl: ModalController,
    private products: ProductsService,
    private tiposSvc: ProductTypesService,
    private cart: CartService,
  ) {
    addIcons({ pricetagOutline });
    this.cart.load();

  }

  ngOnInit(): void {
    this.tiposSvc.list().subscribe(t => (this.tipos = t || []));
    this.search$.pipe(debounceTime(300)).subscribe(txt => {
      this.q = txt?.trim() ?? '';
      this.reload();
    });
    this.reload();
  }

  hasOffer(p: any) {
    return Number(p?.tiene_descuento) === 1 && (Number(p?.porcentaje) > 0 || Number(p?.descuento) > 0);
  }  
  
finalPrice(p: any) {
    const precio = Number(p?.precio ?? 0);
    if (!this.hasOffer(p)) return precio;
    const por = Number(p?.porcentaje ?? 0);
    const des = Number(p?.descuento ?? 0);
    if (por > 0) return +(precio * (1 - por / 100)).toFixed(2);
    if (des > 0) return +(precio - des).toFixed(2);
    return precio;
  }
  
  tipoNombre(id: number) { 
    return this.tipos.find(t => t.id === id)?.nombre ?? id; 
  }

  getTipoNombre(p: any) {
    return (p.tipo_nombre ?? '—').trim();
  }


  onSearch(ev: any) { 
    this.search$.next(ev?.detail?.value ?? ''); 
  }
  
  onTipoChange(ev: any) {
    this.selectedTipos = (ev?.detail?.value ?? []).slice();
    this.reload();
  }

  removeTipo(id: number) {
    this.selectedTipos = this.selectedTipos.filter(x => x !== id);
    this.reload();
  }

  clearTipos() {
    if (!this.selectedTipos.length) return;
    this.selectedTipos = [];
    this.reload();
  }

  reload(ev?: any) {
    this.offset = 0;
    this.items = [];
    this.hasMore = true;
    this.fetch().add?.(() => ev?.target?.complete?.());
  }

  fetch() {
    this.loading = true;
    const tiposCsv = this.selectedTipos.length ? this.selectedTipos.join(',') : null;

    return this.products.list({
      q: this.q,
      limit: this.limit,
      offset: this.offset,
      publicado: 1,       
      tipos: tiposCsv 
    }).subscribe({
      next: (rows) => {
        const data = rows || [];
        this.items = [...this.items, ...data];
        this.hasMore = data.length === this.limit;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadMore(ev: any) {
    if (!this.hasMore) { ev.target.complete(); return; }
    this.offset += this.limit;
    const tiposCsv = this.selectedTipos.length ? this.selectedTipos.join(',') : null;

    this.products.list({
      q: this.q,
      limit: this.limit,
      offset: this.offset,
      publicado: 1,
      tipos: tiposCsv
    }).subscribe({
      next: (rows) => {
        const data = rows || [];
        this.items = [...this.items, ...data];
        this.hasMore = data.length === this.limit;
        ev.target.complete();
      },
      error: () => ev.target.complete()
    });
  }

  async quickAdd(p: any) {
    this.cart.add(p.id, 1).subscribe({
      next: async () => {
        (await this.toast.create({ message: 'Agregado (x1)', duration: 1200, color: 'success'})).present();
      },
      error: async (err) => {
        (await this.toast.create({ message: (err.error?.message ?? 'Error'), duration: 1600, color: 'danger'})).present();
      }
    });
  }

  async openQty(p: any) {
    const modal = await this.modalCtrl.create({
      component: QuantitySheetComponent,
      componentProps: {
        title: p.nombre,
        imageUrl: p.foto_url,
        subtitle: 'Selecciona la cantidad',
        mode: 'priced',
        unitPrice: this.finalPrice(p),
        min: 1,
        max: p.stock ?? undefined,
        initial: 1,
        confirmLabel: 'Agregar al carrito'
      },
      breakpoints: [0, 0.35, 0.6],
      initialBreakpoint: 0.35,
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
    const result = await modal.onWillDismiss<{ cantidad: number }>();
    const qty = result.data?.cantidad ?? 0;
    if (result.role !== 'confirm' || qty <= 0) return;

    this.cart.add(p.id, qty).subscribe({
      next: async () => (await this.toast.create({ message: `Agregado (x${qty})`, duration: 1200, color: 'success' })).present(),
      error: async (err) => (await this.toast.create({ message: err?.error?.message ?? 'Error', duration: 1600, color: 'danger' })).present()
    });
  }

}
