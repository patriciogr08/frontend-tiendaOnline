// src/app/pages/register/register.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonButton, IonText, IonToggle, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonSelect, IonSelectOption,
    IonButton, IonText, IonToggle, IonLabel, IonIcon
  ]
})
export class RegisterPage {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController
  ) { addIcons({ personAddOutline }); }

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
    telefono: [''],

    withAddress: [true],
    tipo: ['SHIPPING'],
    destinatario: [''],
    linea1: [''],
    linea2: [''],
    ciudad: [''],
    provincia: [''],
    codigo_postal: [''],
    pais_codigo: ['EC'],
    tel_dir: [''],
    es_predeterminada: [true]
  });

  get f() { return this.form.controls; }

  private validateAddressBlock(): string | null {
    if (!this.form.value.withAddress) return null;
    const required = ['tipo','destinatario','linea1','ciudad','provincia','pais_codigo'];
    const missing = required.filter(k => !((this.form.get(k) as AbstractControl).value || '').toString().trim());
    return missing.length ? `Faltan campos de dirección: ${missing.join(', ')}` : null;
  }

  async submit() {
    if (this.form.invalid) return;

    const addressError = this.validateAddressBlock();
    if (addressError) {
      (await this.toast.create({ message: addressError, duration: 2200, color: 'warning' })).present();
      return;
    }

    const loader = await this.loading.create({ message: 'Creando cuenta...' });
    await loader.present();

    const v = this.form.value as any;
    const payload: any = {
      correo: v.correo,
      contrasena: v.contrasena,
      nombre_completo: v.nombre_completo,
      telefono: v.telefono || null
    };

    if (v.withAddress) {
      payload.direccion = {
        tipo: v.tipo,
        destinatario: v.destinatario || v.nombre_completo,
        linea1: v.linea1,
        linea2: v.linea2 || null,
        ciudad: v.ciudad,
        provincia: v.provincia,
        codigo_postal: v.codigo_postal || null,
        pais_codigo: (v.pais_codigo || 'EC').toUpperCase(),
        telefono: v.tel_dir || null,
        es_predeterminada: v.es_predeterminada === true
      };
    }

    this.auth.register(payload).subscribe({
      next: async () => {
        await loader.dismiss();
        (await this.toast.create({ message: 'Registro exitoso', duration: 1500, color: 'success' })).present();
        this.router.navigateByUrl('/client', { replaceUrl: true });
      },
      error: async (err) => {
        await loader.dismiss();
        const msg = err?.error?.message || 'No se pudo registrar';
        (await this.toast.create({ message: msg, duration: 2500, color: 'danger' })).present();
      }
    });
  }

  goLogin(){
    this.router.navigateByUrl('/login'); 
  }
}
