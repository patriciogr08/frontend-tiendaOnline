import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,  IonRouterOutlet} from '@ionic/angular/standalone';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { listOutline, timeOutline, personCircleOutline } from 'ionicons/icons';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';

@Component({
    standalone: true,
    selector: 'app-courier-tabs',
    templateUrl: './courier-tabs.page.html',
    styleUrls: ['./courier-tabs.page.scss'],
    imports: [
        CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink,IonRouterOutlet, AppHeaderComponent
    ]
})
export class CourierTabsPage implements OnDestroy {
    title = 'Asignados';
    sub?: Subscription;

    constructor(private router: Router) {
        addIcons({ listOutline, timeOutline, personCircleOutline });

        this.sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
            const url = this.router.url;
            if (url.includes('/courier/orders'))   this.title = 'Asignados';
            else if (url.includes('/courier/profile')) this.title = 'Perfil';
        });
    }

    ngOnDestroy() { this.sub?.unsubscribe(); }
}
