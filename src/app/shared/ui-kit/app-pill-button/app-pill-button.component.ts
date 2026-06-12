import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pill-button',
  standalone: true,
  imports: [IonButton, IonSpinner],
  templateUrl: './app-pill-button.component.html',
  styleUrls: ['./app-pill-button.component.scss'],
})
export class AppPillButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() expand: 'block' | 'full' | undefined = 'block';

  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
