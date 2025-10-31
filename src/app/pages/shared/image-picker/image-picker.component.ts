import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonItem, IonLabel, IonButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { imageOutline, trashOutline } from 'ionicons/icons';

@Component({
    standalone: true,
    selector: 'app-image-picker',
    templateUrl: './image-picker.component.html',
    styleUrls: ['./image-picker.component.scss'],
    imports: [CommonModule, IonItem, IonLabel, IonButton, IonIcon, IonImg]
})
export class ImagePickerComponent {
    @Input() label = 'Imagen';
    @Input() maxMB = 3;
    @Input() accept = 'image/png,image/jpeg,image/webp,image/gif';
    @Input() previewUrl: string | null = null;
    @Output() fileChange = new EventEmitter<File | null>();

    file: File | null = null;

    constructor() { addIcons({ imageOutline, trashOutline }); }

    onInput(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (!f) return;
        if (f.size > this.maxMB * 1024 * 1024) { alert(`Máx ${this.maxMB}MB`); return; }
        this.file = f;
        const reader = new FileReader();
        reader.onload = () => this.previewUrl = String(reader.result || '');
        reader.readAsDataURL(f);
        this.fileChange.emit(this.file);
    }

    clear() {
        this.file = null;
        this.previewUrl = null;
        this.fileChange.emit(null);
    }
}
