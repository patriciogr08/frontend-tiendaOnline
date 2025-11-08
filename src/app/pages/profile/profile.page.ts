import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonItemDivider,
    IonCard, IonCardContent, IonSelect, IonSelectOption, IonToggle, IonNote,
    IonAccordion, IonAccordionGroup,IonAvatar, IonChip,IonBadge
} from '@ionic/angular/standalone';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
    personCircleOutline, logOutOutline, saveOutline, keyOutline, locationOutline,
    addOutline, createOutline, trashOutline, starOutline, star,
    shieldCheckmarkOutline
} from 'ionicons/icons';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { AddressDTO } from 'src/app/core/types/address.type';
import { AddressesService } from 'src/app/core/services/addresses.service';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    imports: [
        CommonModule, ReactiveFormsModule,
        IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput,
        IonCard, IonCardContent, IonSelect, IonSelectOption, IonToggle, IonNote,
        IonItemDivider,IonAccordion,IonAccordionGroup,IonAvatar, IonChip,
        IonBadge
    ]
})
export class ProfilePage implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    user = this.auth.currentUser();

    // Form de datos personales (PUT /me)
    form = this.fb.group({
        nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
        telefono: ['']
    });

    // Form de cambio de contraseña (PUT /me/password)
    passForm = this.fb.group({
        contrasena_actual: ['', [Validators.required]],
        contrasena_nueva:  ['', [Validators.required, Validators.minLength(6)]],
    });

    // Form de direcciones (POST/PUT /me/addresses)
    addrForm = this.fb.group({
        tipo: ['SHIPPING', Validators.required],
        destinatario: ['', Validators.required],
        linea1: ['', Validators.required],
        linea2: [''],
        ciudad: ['', Validators.required],
        provincia: ['', Validators.required],
        codigo_postal: [''],
        pais_codigo: ['EC', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        telefono: [''],
        es_predeterminada: [false, Validators.required]
    });

    addresses: AddressDTO[] = [];
    editingId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private profile: ProfileService,
        private addrApi: AddressesService,
        private loading: LoadingController,
        private toast: ToastController,
        private alert: AlertController,
        private router: Router
    ) {
        addIcons({
        personCircleOutline, logOutOutline, saveOutline, keyOutline, locationOutline,
        addOutline, createOutline, trashOutline, starOutline, star, shieldCheckmarkOutline 
        });
    }

    ngOnInit(): void {
        this.loadUser();
        this.loadAddresses();
    }

    // ===== USER =====
    loadUser() {
        this.profile.getMe().subscribe(u => {
        this.user = u;
        this.form.setValue({
            nombre_completo: u?.nombre_completo || '',
            telefono: u?.telefono || ''
        });
        // refresca cache local (opcional)
        localStorage.setItem('user', JSON.stringify(u));
        });
    }

    async saveUser() {
        if (this.form.invalid) return;
        const loader = await this.loading.create({ message: 'Guardando perfil...' });
        await loader.present();

        this.profile.putMe(this.form.value as any).subscribe({
        next: async (u) => {
            await loader.dismiss();
            (await this.toast.create({ message: 'Perfil actualizado', duration: 1400, color: 'success' })).present();
            localStorage.setItem('user', JSON.stringify(u));
            this.user = u;
        },
        error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error al actualizar', duration: 2200, color: 'danger' })).present();
        }
        });
    }

    async changePassword() {
        if (this.passForm.invalid) return;
        const loader = await this.loading.create({ message: 'Actualizando contraseña...' });
        await loader.present();

        this.profile.cangePassword(this.passForm.value as any).subscribe({
        next: async () => {
            await loader.dismiss();
            this.passForm.reset();
            (await this.toast.create({ message: 'Contraseña actualizada', duration: 1500, color: 'success' })).present();
        },
        error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error al actualizar clave', duration: 2200, color: 'danger' })).present();
        }
        });
    }

    async logout() {
        this.auth.logout().subscribe({
            complete: () => this.router.navigateByUrl('/login', { replaceUrl: true }),
            error:    () => this.router.navigateByUrl('/login', { replaceUrl: true })
        });
        (await this.toast.create({ message: 'Sesión cerrada', duration: 1000, color: 'medium' })).present();
    }

    // ===== ADDRESSES =====
    loadAddresses() {
        this.addrApi.list().subscribe(rows => this.addresses = rows);
    }

    editAddress(a: AddressDTO) {
        this.editingId = a.id!;
        this.addrForm.setValue({
        tipo: a.tipo,
        destinatario: a.destinatario,
        linea1: a.linea1,
        linea2: a.linea2 || '',
        ciudad: a.ciudad,
        provincia: a.provincia,
        codigo_postal: a.codigo_postal || '',
        pais_codigo: a.pais_codigo,
        telefono: a.telefono || '',
        es_predeterminada: !!a.es_predeterminada
        });
    }

    cancelEditAddress() {
        this.editingId = null;
        this.addrForm.reset({
        tipo: 'SHIPPING',
        destinatario: '',
        linea1: '',
        linea2: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        pais_codigo: 'EC',
        telefono: '',
        es_predeterminada: false
        });
    }

    async saveAddress() {
        if (this.addrForm.invalid) return;
        const loader = await this.loading.create({ message: this.editingId ? 'Actualizando dirección...' : 'Creando dirección...' });
        await loader.present();

        const dto = {
            ...this.addrForm.value,
            linea2: this.addrForm.value.linea2 || null,
            codigo_postal: this.addrForm.value.codigo_postal || null
        } as AddressDTO;

        const req = this.editingId
                    ? this.addrApi.update(this.editingId, dto)
                    : this.addrApi.create(dto);

        req.subscribe({
        next: async () => {
            await loader.dismiss();
            (await this.toast.create({ message: 'Dirección guardada', duration: 1200, color: 'success' })).present();
            this.cancelEditAddress();
            this.loadAddresses();
        },
        error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error', duration: 2200, color: 'danger' })).present();
        }
        });
    }

    async setDefault(a: AddressDTO) {
        const loader = await this.loading.create({ message: 'Marcando predeterminada...' });
        await loader.present();
        this.addrApi.setDefault(a.id!).subscribe({
        next: async () => { await loader.dismiss(); this.loadAddresses(); },
        error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error', duration: 2200, color: 'danger' })).present();
        }
        });
    }

    async removeAddress(a: AddressDTO) {
        const confirm = await this.alert.create({
        header: 'Eliminar',
        message: '¿Deseas eliminar esta dirección?',
        buttons: [
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', role: 'destructive', handler: () => this._doRemove(a.id!) }
        ]
        });
        await confirm.present();
    }

    private async _doRemove(id: number) {
        const loader = await this.loading.create({ message: 'Eliminando...' });
        await loader.present();
        this.addrApi.remove(id).subscribe({
        next: async () => { await loader.dismiss(); this.loadAddresses(); },
        error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error', duration: 2200, color: 'danger' })).present();
        }
        });
    }

    public typeDirection( type :string ) {
        return type.toUpperCase() == 'SHIPPING' ? 'ENVIO' : 'FACTURACIÓN'; 
    }

    pickAvatar() {
        this.fileInput.nativeElement.click();
    }

    async onFileSelected(ev: Event) {
        const input = ev.target as HTMLInputElement;
        const file = input.files && input.files[0];
        if (!file) return;

        if (!['image/png','image/jpeg','image/webp'].includes(file.type)) {
            (await this.toast.create({ message: 'Formato no permitido', duration: 1800, color: 'warning' })).present();
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            (await this.toast.create({ message: 'Máximo 2MB', duration: 1800, color: 'warning' })).present();
            return;
        }

        const loader = await this.loading.create({ message: 'Subiendo avatar...' });
        await loader.present();

        this.profile.uploadAvatar(file).subscribe({
            next: async (user) => {
            await loader.dismiss();
            this.user = user;                                 // viene con URL ABSOLUTA
            localStorage.setItem('user', JSON.stringify(user));
            (await this.toast.create({ message: 'Avatar actualizado', duration: 1200, color: 'success' })).present();
            this.fileInput.nativeElement.value = '';
            },
            error: async (err) => {
            await loader.dismiss();
            (await this.toast.create({ message: err?.error?.message || 'Error al subir avatar', duration: 2200, color: 'danger' })).present();
            this.fileInput.nativeElement.value = '';
            }
        });
    }

}
