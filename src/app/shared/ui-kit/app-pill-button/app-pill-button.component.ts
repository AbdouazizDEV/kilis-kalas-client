import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pill-button',
  standalone: true,
  imports: [IonButton, IonSpinner],
  templateUrl: './app-pill-button.component.html',
  styleUrls: ['./app-pill-button.component.scss'],
})
export class AppPillButtonComponent {
  private readonly router = inject(Router);

  @Input() disabled = false;
  @Input() loading = false;
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() routerLink?: string | string[];

  @Output() buttonClick = new EventEmitter<void>();

  onClick(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.disabled || this.loading) {
      return;
    }

    if (this.buttonClick.observed) {
      this.buttonClick.emit();
      return;
    }

    if (this.routerLink) {
      void this.router.navigateByUrl(this.resolveRoute(this.routerLink));
    }
  }

  private resolveRoute(link: string | string[]): string {
    if (typeof link === 'string') {
      return link;
    }

    return `/${link.filter(Boolean).join('/')}`;
  }
}
