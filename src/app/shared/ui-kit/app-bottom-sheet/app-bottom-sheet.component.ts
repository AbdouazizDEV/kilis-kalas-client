import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonBackdrop,
  IonContent,
  IonHeader,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonBackdrop, IonText],
  templateUrl: './app-bottom-sheet.component.html',
  styleUrls: ['./app-bottom-sheet.component.scss'],
})
export class AppBottomSheetComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() breakpoints: number[] = [0, 0.5, 0.85];
  @Input() initialBreakpoint = 0.5;

  @Output() dismissed = new EventEmitter<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }
}
