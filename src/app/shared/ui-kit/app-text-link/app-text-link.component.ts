import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

export type AppTextLinkVariant = 'default' | 'accent';

@Component({
  selector: 'app-text-link',
  standalone: true,
  imports: [IonButton],
  templateUrl: './app-text-link.component.html',
  styleUrls: ['./app-text-link.component.scss'],
})
export class AppTextLinkComponent {
  private readonly router = inject(Router);

  @Input() variant: AppTextLinkVariant = 'default';
  @Input() routerLink?: string | string[];
  @Input() underline = true;

  @Output() linkClick = new EventEmitter<void>();

  onClick(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.linkClick.emit();

    if (!this.routerLink) {
      return;
    }

    void this.router.navigateByUrl(this.resolveRoute(this.routerLink));
  }

  private resolveRoute(link: string | string[]): string {
    if (typeof link === 'string') {
      return link;
    }

    return `/${link.filter(Boolean).join('/')}`;
  }
}
