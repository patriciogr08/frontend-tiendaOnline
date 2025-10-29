import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { addCircleOutline, cartOutline, removeCircleOutline } from 'ionicons/icons';

export type QuantityMode = 'plain' | 'priced'; // plain: solo cantidad, priced: muestra precio y subtotal

@Component({
  standalone: true,
  selector: 'app-quantity-sheet',
  templateUrl: './quantity-sheet.component.html',
  styleUrls: ['./quantity-sheet.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuantitySheetComponent {
    /** Título del sheet */
    @Input() title = 'Selecciona cantidad';
    /** Imagen y texto opcional (por ej. producto) */
    @Input() imageUrl?: string | null;
    @Input() subtitle?: string;

    /** Modo: 'plain' solo cantidad; 'priced' muestra precio unitario y subtotal */
    @Input() mode: QuantityMode = 'plain';
    @Input() unitPrice = 0;       // usado en mode 'priced'

    /** Límites y paso */
    @Input() min = 1;
    @Input() max?: number;
    @Input() step = 1;
    @Input() initial = 1;

    /** Etiquetas */
    @Input() confirmLabel = 'Confirmar';
    @Input() cancelLabel = 'Cancelar';

    /** Eventos (útil si alguna vez lo usas embebido sin modal) */
    @Output() confirmed = new EventEmitter<number>();
    @Output() cancelled = new EventEmitter<void>();

    qty = signal<number>(1);
    subtotal = computed(() => +(this.qty() * Number(this.unitPrice || 0)).toFixed(2));

    constructor(private modalCtrl: ModalController) {
        addIcons({
            'add-circle-outline': addCircleOutline,
            'remove-circle-outline': removeCircleOutline,
            'cart-outline': cartOutline
        });
    }

    ngOnInit() { this.qty.set(Math.max(this.min, this.initial)); }

    inc() {
        const next = this.qty() + this.step;
        if (this.max && next > this.max) return;
        this.qty.set(next);
    }
    dec() {
        const next = this.qty() - this.step;
        if (next < this.min) return;
        this.qty.set(next);
    }
    onQtyInput(v: any) {
        let n = Math.floor(Number(v ?? this.min));
        if (isNaN(n) || n < this.min) n = this.min;
        if (this.max && n > this.max) n = this.max;
        // ajusta al múltiplo del step
        const rem = (n - this.min) % this.step;
        if (rem !== 0) n = n - rem;
        this.qty.set(n);
    }

    confirm() {
        this.confirmed.emit(this.qty());
        // si viene como modal, devuelve data
        this.modalCtrl.getTop().then(m => m?.dismiss({ cantidad: this.qty() }, 'confirm'));
    }
    cancel() {
        this.cancelled.emit();
        this.modalCtrl.getTop().then(m => m?.dismiss(null, 'cancel'));
    }
}
