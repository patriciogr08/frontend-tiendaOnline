import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonLabel, IonSearchbar,
    IonRadioGroup, IonRadio, IonTextarea
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { OrdersService } from 'src/app/core/services/orders.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-assign-repartidor-modal',
    templateUrl: './assign-repartidor.modal.html',
    styleUrls: ['./assign-repartidor.modal.scss'],
    imports: [
        CommonModule, ReactiveFormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
        IonContent, IonList, IonItem, IonLabel, IonSearchbar,
        IonRadioGroup, IonRadio, IonTextarea
    ]
})
export class AssignRepartidorModal implements OnDestroy {
    @Input() pedidoId!: number;

    form: FormGroup = this.fb.group({
        q: [''],
        repartidor_usuario_id: [null, Validators.required],
        notas: ['', [Validators.maxLength(500)]],
    });

    loading = false;
    rows: any[] = [];
    private sub?: Subscription;

    constructor(
        private modalCtrl: ModalController,
        private api: OrdersService,
        private fb: FormBuilder
    ) {
        addIcons({ closeOutline, checkmarkOutline });

        // Buscar repartidores reactivo con debounce
        this.sub = this.form.get('q')!.valueChanges
        .pipe(debounceTime(250), distinctUntilChanged())
        .subscribe(v => this.search(String(v || '')));

        // primera carga
        this.search('');
    }

    ngOnDestroy() { this.sub?.unsubscribe(); }

    search(q: string) {
        this.loading = true;
        this.api.listCouriers(q).subscribe({
        next: rs => { this.rows = rs; this.loading = false; },
        error: _ => { this.loading = false; }
        });
    }

    selectCourier(id: number) {
        this.form.get('repartidor_usuario_id')!.setValue(id);
    }

    confirm() {
        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }
        const { repartidor_usuario_id, notas } = this.form.value;
        this.modalCtrl.dismiss({ repartidor_usuario_id, notas }, 'ok');
    }

    close() { this.modalCtrl.dismiss(null, 'cancel'); }
}
