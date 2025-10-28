import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
    standalone: true,
    selector: 'app-admin-dashboard',
    imports: [CommonModule, IonContent],
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {}
