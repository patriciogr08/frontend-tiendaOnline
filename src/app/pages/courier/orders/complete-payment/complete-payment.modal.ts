import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonItem, IonLabel, IonRadioGroup, IonRadio, IonInput, 
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline, imageOutline, cashOutline, cardOutline } from 'ionicons/icons';
import { ImagePickerComponent } from 'src/app/pages/shared/image-picker/image-picker.component';

@Component({
    standalone: true,
    selector: 'app-complete-payment-modal',
    templateUrl: './complete-payment.modal.html',
    styleUrls: ['./complete-payment.modal.scss'],
    imports: [
        CommonModule, ReactiveFormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
        IonContent, IonItem, IonLabel, IonRadioGroup, IonRadio, IonInput,
        ImagePickerComponent
    ]
})
export class CompletePaymentModal {
    @Input() pedidoId!: number;
    @Input() total!: number;
    form = this.fb.group({
        metodo: ['EFECTIVO', Validators.required],
        monto: [0, [Validators.required, Validators.min(0.01)]],
        file: [null as File | null, Validators.required], // comprobante obligatorio
        notas: ['']
    });
    preview?: string;

    constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
        addIcons({ closeOutline, checkmarkOutline, imageOutline, cashOutline, cardOutline });
    }

    ngOnInit() { if (this.total) this.form.patchValue({ monto: this.total }); }

    setFile(file: File | null) {
        this.form.get('file')!.setValue(file);
        this.form.get('file')!.markAsTouched();

        if (file) {
            const reader = new FileReader();
            reader.onload = () => this.preview = String(reader.result || '');
            reader.readAsDataURL(file);
        } else {
            this.preview = '';
        }
    }

    confirm() {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        const { metodo, monto, file, notas } = this.form.value;
        this.modalCtrl.dismiss({ metodo, monto, file, notas }, 'ok');
    }

    close() { this.modalCtrl.dismiss(null, 'cancel'); }
}
