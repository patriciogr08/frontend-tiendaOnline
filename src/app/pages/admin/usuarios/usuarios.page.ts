// src/app/pages/admin/usuarios/usuarios.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonList, IonItem, IonBadge, IonInput, IonSelect, IonSelectOption,
  IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { FormsModule ,ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, addOutline, searchOutline, lockClosedOutline, lockOpenOutline, personAddOutline, createOutline } from 'ionicons/icons';
import { UsersService } from 'src/app/core/services/users.service';
import { AdminUser } from 'src/app/core/types/AdminUser.types';
import { CreateRepartidorModal } from './create-repartidor/create-repartidor.modal';


@Component({
    standalone: true,
    selector: 'app-admin-usuarios',
    templateUrl: './usuarios.page.html',
    styleUrls: ['./usuarios.page.scss'],
    imports: [
        CommonModule, ReactiveFormsModule,FormsModule,
        IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
        IonList, IonItem, IonBadge, IonInput, IonSelect, IonSelectOption,
        IonCard, IonCardContent
    ],
    providers:[ModalController]
})
export class UsuariosPage implements OnInit {
    q = '';
    estado: ''|'ACTIVE'|'BLOCKED' = '';
    limit = 20;
    offset = 0;
    hasMore = true;

    loading = false;
    rows: any[] = [];
    debounce?: any;

    form = this.fb.group({
        nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        telefono: [''],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });

    constructor(
        private fb: FormBuilder,
        private api: UsersService,
        private toast: ToastController,
        private alert: AlertController,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController
    ) {
        addIcons({ 
            peopleOutline, addOutline, searchOutline, lockClosedOutline, 
            lockOpenOutline, personAddOutline, createOutline
        });
    }

    ngOnInit(): void {
        this.reload();
    }
    
    applyFilters() {
        this.reload();
    }

    onFilterInput() {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => this.applyFilters(), 400);
    }


    async reload() {
        this.offset = 0; this.hasMore = true; this.rows = [];
        await this.fetch();
    }

    async fetch() {
        if (!this.hasMore || this.loading) return;
        this.loading = true;
        this.api.list({ q: this.q, estado: this.estado, limit: this.limit, offset: this.offset })
        .subscribe({
            next: (data) => {
                this.rows = [...this.rows, ...data];
                this.offset += data.length;
                this.hasMore = data.length === this.limit;
                this.loading = false;
                },
            error: async () => {
                this.loading = false;
                (await this.toast.create({ message: 'Error cargando usuarios', duration: 1600, color: 'danger' })).present();
            }
        });
    }

    async toggleStatus(u: AdminUser) {
        const nuevo = u.estado === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        const loader = await this.loadingCtrl.create({ message: (nuevo==='BLOCKED'?'Bloqueando...':'Desbloqueando...') });
        await loader.present();
        this.api.setStatus(u.id, nuevo).subscribe({
            next: async (res) => {
                await loader.dismiss();
                const idx = this.rows.findIndex(x => x.id === u.id);
                if (idx >= 0) this.rows[idx] = res;
                (await this.toast.create({ message: 'Estado actualizado', duration: 1200, color: 'success' })).present();
            },
            error: async (err) => {
                await loader.dismiss();
                (await this.toast.create({ message: err?.error?.message || 'Error', duration: 1800, color: 'danger' })).present();
            }
        });
    }

    async createRepartidor() {
        if (this.form.invalid) return;
        const loader = await this.loadingCtrl.create({ message: 'Creando repartidor...' });
        await loader.present();
        this.api.createRepartidor(this.form.value as any).subscribe({
            next: async (res) => {
                await loader.dismiss();
                this.rows = [res, ...this.rows];
                this.form.reset();
                (await this.toast.create({ message: 'Repartidor creado', duration: 1400, color: 'success' })).present();
            },
            error: async (err) => {
                await loader.dismiss();
                (await this.toast.create({ message: err?.error?.message || 'No se pudo crear', duration: 1800, color: 'danger' })).present();
            }
        });
    }

    async openCreateRepartidor() {
        const modal = await this.modalCtrl.create({
            component: CreateRepartidorModal,
            componentProps: {}
        });
        await modal.present();

        const { data, role } = await modal.onDidDismiss();
        if (role === 'created' && data) {
            this.rows = [data, ...this.rows];
            (await this.toast.create({ message: 'Repartidor creado', duration: 1400, color: 'success' })).present();
        }
    }

    async editUser(u: AdminUser) {
        const alert = await this.alert.create({
            header: 'Editar usuario',
            inputs: [
                { name: 'nombre_completo', type: 'text', value: u.nombre_completo, placeholder: 'Nombre completo' },
                { name: 'telefono', type: 'text', value: u.telefono || '', placeholder: 'Teléfono' }
                ],
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Guardar',
                    handler: async (values) => {
                    const nombre = (values?.nombre_completo || '').trim();
                    if (!nombre) {
                        (await this.toast.create({ message: 'El nombre es obligatorio', duration: 1400, color: 'warning' })).present();
                        return false;
                    }
                    const loader = await this.loadingCtrl.create({ message: 'Actualizando...' });
                    await loader.present();
                    this.api.updateBasic(u.id, { nombre_completo: nombre, telefono: values.telefono || null })
                        .subscribe({
                        next: async (res) => {
                            await loader.dismiss();
                            const i = this.rows.findIndex(x => x.id === u.id);
                            if (i >= 0) this.rows[i] = res;
                            (await this.toast.create({ message: 'Usuario actualizado', duration: 1200, color: 'success' })).present();
                        },
                        error: async (err) => {
                            await loader.dismiss();
                            (await this.toast.create({ message: err?.error?.message || 'No se pudo actualizar', duration: 1800, color: 'danger' })).present();
                        }
                        });
                    return true;
                    }
                }
            ]
        });
        await alert.present();
    }
}
