import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IonButton, IonIcon, IonSpinner],
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
})
export class AppButtonComponent {
  @Input() variant: AppButtonVariant = 'primary';
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconSlot: 'start' | 'end' = 'start';

  @Output() buttonClick = new EventEmitter<void>();

  get color(): string {
    return this.variant === 'secondary' ? 'secondary' : 'primary';
  }

  get fill(): 'solid' | 'outline' | 'clear' {
    return this.variant === 'outline' ? 'outline' : 'solid';
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
