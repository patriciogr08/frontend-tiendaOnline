// src/app/pages/home/home.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import {
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    imports: [
        CommonModule,
        IonHeader, IonToolbar, IonTitle, IonContent,
        IonButton, IonList, IonItem, IonLabel
    ]
    })
    export class HomePage {
    user = this.auth.currentUser(); // viene del localStorage

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    logout() {
        this.auth.logout().subscribe({
        complete: () => this.router.navigateByUrl('/login', { replaceUrl: true }),
        error:   () => this.router.navigateByUrl('/login', { replaceUrl: true })
        });
    }

    irLogin(){
        this.router.navigateByUrl('/login', { replaceUrl: true })
    }
}
