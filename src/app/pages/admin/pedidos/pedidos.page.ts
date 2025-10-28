import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
    standalone: true,
    selector: 'app-admin-pedidos',
    imports: [CommonModule, IonContent],
    templateUrl: './pedidos.page.html',
    styleUrls: ['./pedidos.page.scss']
})
export class PedidosPage {}
