// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput,
  IonButton, IonIcon, IonText, IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, logInOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput,
    IonButton, IonIcon, IonText, IonImg
  ]
})
export class LoginPage {
  showPassword = false;
  anio = new Date().getFullYear()

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController
  ) {
    addIcons({ eye, eyeOff, logInOutline });
  }

  get f() { return this.form.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

async submit() {
  if (this.form.invalid) return;
  const loader = await this.loading.create({ message: 'Ingresando...' });
  await loader.present();

  this.auth.login(this.form.value as any).subscribe({
    next: async (res: any) => {
      await loader.dismiss();
      
      const t = await this.toast.create({ message: '¡Bienvenido!', duration: 1500, color: 'success' });
      await t.present();

      const rol = res?.user?.rol ?? this.auth.currentUser()?.rol;
      if (rol === 'ADMIN') {
        this.router.navigateByUrl('/admin', { replaceUrl: true });
      } else if (rol === 'REPARTIDOR') {
        this.router.navigateByUrl('/courier/orders', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/shop', { replaceUrl: true });
      }
    },
    error: async (err) => {
      await loader.dismiss();
      const msg = err?.error?.message ?? 'No se pudo iniciar sesión';
      const t = await this.toast.create({ message: msg, duration: 2500, color: 'danger', icon: 'warning' });
      await t.present();
    }
  });
}
}
