
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet,IonBadge
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { cubeOutline, personCircleOutline, homeOutline, cartOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';
import { CartService } from 'src/app/core/services/cart.service';
@Component({
  standalone: true,
  selector: 'app-client-tabs',
  templateUrl: './client-tabs.page.html',
  styleUrls: ['./client-tabs.page.scss'],
  imports: [
    CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
    IonRouterOutlet, RouterLink, AppHeaderComponent,IonBadge]
})
export class ClientTabsPage implements OnDestroy {
  title = 'Catálogo';
  sub?: Subscription;

  constructor(
    private router: Router,
    public cart: CartService
  ) {
    addIcons({ homeOutline, cartOutline, cubeOutline, personCircleOutline });

    this.sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        if (url.includes('/client/shop'))      this.title = 'Catálogo';
        else if (url.includes('/client/cart')) this.title = 'Carrito';
        else if (url.includes('/client/orders')) this.title = 'Mis pedidos';
        else if (url.includes('/client/profile')) this.title = 'Perfil';
      });
  }
  
  ngOnDestroy(){ this.sub?.unsubscribe(); }
}
