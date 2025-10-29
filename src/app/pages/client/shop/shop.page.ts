import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-client-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  imports: [CommonModule, IonContent]
})
export class ShopPage {}
