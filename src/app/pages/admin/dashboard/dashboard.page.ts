import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { peopleOutline, personOutline } from 'ionicons/icons';

@Component({
    standalone: true,
    selector: 'app-admin-dashboard',
    imports: [
        CommonModule,
        IonContent,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent,
        IonButton, IonIcon
    ],
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
    })
    export class DashboardPage {
    constructor(private router: Router) {
        addIcons({ peopleOutline, personOutline });
    }

    goClient()  { 
        this.router.navigateByUrl('/client'); 
    }

    goCourier() { 
        this.router.navigateByUrl('/courier'); 
    }
}