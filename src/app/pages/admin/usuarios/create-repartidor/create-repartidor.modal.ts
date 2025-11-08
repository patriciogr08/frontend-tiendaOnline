import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonInput, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  standalone: true,
  selector: 'app-create-repartidor-modal',
  templateUrl: './create-repartidor.modal.html',
  styleUrls: ['./create-repartidor.modal.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonInput, IonCard, IonCardContent
  ]
})
export class CreateRepartidorModal {
    form = this.fb.group({
        nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        telefono: [''],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });

    constructor(
        private fb: FormBuilder,
        private api: UsersService,
        private modalCtrl: ModalController,
        private toast: ToastController,
        private loading: LoadingController
    ) {
        addIcons({ closeOutline, saveOutline });
    }

    dismiss() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

  async save() {
        if (this.form.invalid) return;
        const loader = await this.loading.create({ message: 'Creando...' });
        await loader.present();

        this.api.createRepartidor(this.form.value as any).subscribe({
        next: async (user) => {
            await loader.dismiss();
            this.modalCtrl.dismiss(user, 'created');
        },
        error: async (err) => {
            await loader.dismiss();
            const msg = err?.error?.message || 'No se pudo crear';
            (await this.toast.create({ message: msg, duration: 1800, color: 'danger' })).present();
        }
        });
    }
}
