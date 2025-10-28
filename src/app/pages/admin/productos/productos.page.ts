import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonSearchbar,
  IonFab, IonFabButton, IonSpinner, IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent, IonSelect, IonSelectOption, IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, addOutline } from 'ionicons/icons';
import { ProductsService } from '../../../core/services/products.service';
import { ProductFormModal } from './product-form.modal';
import { ModalController, ToastController } from '@ionic/angular';
import { ProductTypesService } from '../../../core/services/product-types.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-admin-productos',
    templateUrl: './productos.page.html',
    styleUrls: ['./productos.page.scss'],
    imports: [
        CommonModule, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
        IonSearchbar, IonFab, IonFabButton, IonSpinner, IonRefresher, IonRefresherContent,
        IonInfiniteScroll, IonInfiniteScrollContent, IonSelect, IonSelectOption, IonToggle
    ],
    providers: [ModalController]
})
export class ProductosPage implements OnInit {
    loading = false;
    items: any[] = [];
    tipos: any[] = [];

    // filtros
    q = '';
    tipo: number|null = null;
    publicado: number|null = null;

    // paginación
    limit = 20;
    offset = 0;
    hasMore = true;

    private search$ = new Subject<string>();

    constructor(
        private svc: ProductsService,
        private tiposSvc: ProductTypesService,
        private modal: ModalController,
        private toast: ToastController
    ) {
        addIcons({ createOutline, trashOutline, addOutline });
        this.search$.pipe(debounceTime(300)).subscribe(text => {
        this.q = text || '';
        this.reload();
        });
    }

    ngOnInit() {
        this.tiposSvc.list().subscribe(t => this.tipos = t || []);
        this.reload();
    }

    // recarga desde cero
    reload(event?: any) {
        this.offset = 0;
        this.hasMore = true;
        this.items = [];
        this.fetch().add(() => event?.target?.complete?.());
    }

    // trae página
    fetch() {
        this.loading = true;
        return this.svc.list({
        q: this.q, limit: this.limit, offset: this.offset,
        tipo: this.tipo, publicado: this.publicado
        }).subscribe({
        next: rows => {
            const data = rows || [];
            this.items = [...this.items, ...data];
            this.hasMore = data.length === this.limit;
            this.loading = false;
        },
        error: async () => {
            this.loading = false;
            (await this.toast.create({ message: 'Error al cargar', duration: 1500, color: 'danger' })).present();
        }
        });
    }

    // infinite
    loadMore(ev: any) {
        if (!this.hasMore) { ev.target.complete(); return; }
        this.offset += this.limit;
        this.svc.list({
        q: this.q, limit: this.limit, offset: this.offset,
        tipo: this.tipo, publicado: this.publicado
        }).subscribe({
        next: rows => {
            const data = rows || [];
            this.items = [...this.items, ...data];
            this.hasMore = data.length === this.limit;
            ev.target.complete();
        },
        error: async () => {
            ev.target.complete();
            (await this.toast.create({ message: 'Error al cargar', duration: 1500, color: 'danger' })).present();
        }
        });
    }

    // filtros
    onSearch(ev: any) { this.search$.next(ev?.detail?.value ?? ''); }
    onChangeTipo(ev: any) { this.tipo = ev?.detail?.value ?? null; this.reload(); }
    onChangePublicado(ev: any) { this.publicado = ev?.detail?.checked ? 1 : null; this.reload(); }

    async openCreate() {
        const modal = await this.modal.create({ component: ProductFormModal, componentProps: { mode: 'create' } });
        await modal.present();
        const { role } = await modal.onWillDismiss();
        if (role === 'saved') this.reload();
    }

    async openEdit(model: any) {
        const modal = await this.modal.create({ component: ProductFormModal, componentProps: { mode: 'edit', model } });
        await modal.present();
        const { role } = await modal.onWillDismiss();
        if (role === 'saved') this.reload();
    }

    async remove(item: any) {
        this.svc.remove(item.id).subscribe({
        next: async () => { (await this.toast.create({ message: 'Eliminado', duration: 1200, color: 'success' })).present(); this.reload(); },
        error: async () => { (await this.toast.create({ message: 'No se pudo eliminar', duration: 1500, color: 'danger' })).present(); }
        });
    }
}
