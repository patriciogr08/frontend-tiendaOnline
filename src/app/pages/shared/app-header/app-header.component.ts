import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonChip, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonChip, IonLabel]
})
export class AppHeaderComponent {
    @Input() title = 'Tienda Online';
    @Input() showLogout = true;
    user = this.auth.currentUser();

    constructor(private auth: AuthService, private router: Router) {
        addIcons({ logOutOutline });
    }

    logout() {
        console.log('[HEADER] click logout'); // <-- ver en consola
        this.auth.logout().subscribe({
            complete: () => this.router.navigateByUrl('/login', { replaceUrl: true }),
            error:    () => this.router.navigateByUrl('/login', { replaceUrl: true })
        });
    }
}
