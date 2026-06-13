import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [IonButton, IonImg],
  templateUrl: './app-back-button.component.html',
  styleUrls: ['./app-back-button.component.scss'],
})
export class AppBackButtonComponent {
  private readonly router = inject(Router);

  @Input() defaultHref = '/auth/login';
  @Output() backClick = new EventEmitter<void>();

  onBack(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.backClick.emit();
    void this.router.navigateByUrl(this.defaultHref);
  }
}
