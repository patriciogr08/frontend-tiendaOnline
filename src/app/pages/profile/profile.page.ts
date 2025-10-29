

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline, keyOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
    standalone: true,
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    imports: [CommonModule, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput]
})
export class ProfilePage {
    user = this.auth.currentUser();

    constructor(private auth: AuthService, private toast: ToastController) {
        addIcons({ personCircleOutline, logOutOutline, keyOutline });
    }

    async logout() {
        this.auth.logout();
        (await this.toast.create({ message: 'Sesión cerrada', duration: 1000, color: 'medium' })).present();
    }

    // placeholder para cambiar clave más adelante
    changePassword() {/* TODO */}
}
