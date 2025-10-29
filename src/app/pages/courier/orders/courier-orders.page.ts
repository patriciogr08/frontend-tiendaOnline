import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
    standalone: true,
    selector: 'app-courier-orders',
    templateUrl: './courier-orders.page.html',
    styleUrls: ['./courier-orders.page.scss'],
    imports: [CommonModule, IonContent]
})
export class CourierOrdersPage {}