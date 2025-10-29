// tabs.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonBadge
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { speedometerOutline, bagHandleOutline, peopleOutline, cubeOutline, personCircleOutline } from 'ionicons/icons';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';

@Component({
  standalone: true,
  selector: 'app-admin-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonBadge, RouterLink, AppHeaderComponent]
})
export class AdminTabsPage {
    title = 'Admin';
    pendingCount = 0;

    constructor(private router: Router) {
        addIcons({ speedometerOutline, bagHandleOutline, peopleOutline, cubeOutline, personCircleOutline });

        this.router.events.pipe( filter(e => e instanceof NavigationEnd)).subscribe(() => {
            // Baja por el árbol hasta la ruta más profunda
            let r = this.router.routerState.root;
            let t = 'Admin';
            while (r.firstChild) {
                r = r.firstChild;
                const maybe = r.snapshot.data?.['title'];
                if (maybe) t = maybe; // toma el último title definido
            }
            this.title = t;
        });
    }
}
