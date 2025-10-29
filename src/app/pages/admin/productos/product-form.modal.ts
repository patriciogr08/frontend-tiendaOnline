import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonList, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonToggle
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ProductsService } from '../../../core/services/products.service';
import { ProductTypesService } from '../../../core/services/product-types.service';
import { ImagePickerComponent } from '../../shared/image-picker/image-picker.component';

@Component({
  standalone: true,
  selector: 'app-product-form-modal',
  templateUrl: './product-form.modal.html',
  styleUrls: ['./product-form.modal.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
    IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonToggle,
    ImagePickerComponent
  ]
})
export class ProductFormModal implements OnInit {
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() model: any = null;

    tipos: any[] = [];
    selectedFile: File | null = null;

    form = this.fb.group({
        tipo_producto_id: [null],
        nombre: ['', [Validators.required, Validators.maxLength(200)]],
        descripcion: [''],
        precio: [0, [Validators.required, Validators.min(0)]],
        publicado: [false],
        tiene_descuento: [false],
        descuento: [0],
        porcentaje: [0],
    });

    // Validación de imagen
    maxImageMB = 5;
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    constructor(
        private fb: FormBuilder,
        private modal: ModalController,
        private toast: ToastController,
        private products: ProductsService,
        private tiposSvc: ProductTypesService
    ) {}

    ngOnInit() {
        this.tiposSvc.list().subscribe(t => this.tipos = t || []);

        if (this.mode === 'edit' && this.model) {
            this.form.patchValue({
                tipo_producto_id: this.model.tipo_producto_id ?? null,
                nombre: this.model.nombre ?? '',
                descripcion: this.model.descripcion ?? '',
                precio: this.model.precio ?? 0,
                publicado: !!this.model.publicado,
                tiene_descuento: !!this.model.tiene_descuento,
                descuento: this.model.descuento ?? 0,
                porcentaje: this.model.porcentaje ?? 0,
            });
        }
    }

    setFile(f: File | null) { this.selectedFile = f; }

    private async validateImage(): Promise<boolean> {
        if (!this.selectedFile) return true; // imagen opcional
        if (!this.allowedTypes.includes(this.selectedFile.type)) {
            (await this.toast.create({ message: 'Formato inválido (jpg, png, webp, gif)', duration: 2000, color: 'warning' })).present();
            return false;
        }
        if (this.selectedFile.size > this.maxImageMB * 1024 * 1024) {
            (await this.toast.create({ message: `Imagen > ${this.maxImageMB}MB`, duration: 2000, color: 'warning' })).present();
            return false;
        }
        return true;
    }

    close() { this.modal.dismiss(null, 'cancel'); }

    async save() {
        if (this.form.invalid) return;
        if (!(await this.validateImage())) return;

        const dto = {
            ...this.form.value,
            publicado: this.form.value.publicado ? 1 : 0,
            tiene_descuento: this.form.value.tiene_descuento ? 1 : 0
        };

        const req$ = this.mode === 'create'
        ? this.products.create(dto, this.selectedFile || undefined)
        : this.products.update(this.model.id, dto, this.selectedFile || undefined);

        req$.subscribe({
        next: async () => {
            (await this.toast.create({ message: 'Guardado', duration: 1500, color: 'success' })).present();
            this.modal.dismiss(true, 'saved');
        },
        error: async () => {
            (await this.toast.create({ message: 'Error al guardar', duration: 2000, color: 'danger' })).present();
        }
        });
    }
}
