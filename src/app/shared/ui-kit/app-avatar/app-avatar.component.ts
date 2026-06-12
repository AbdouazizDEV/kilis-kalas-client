import { Component, Input } from '@angular/core';
import { IonAvatar, IonIcon, IonImg, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [IonAvatar, IonIcon, IonImg, IonText],
  templateUrl: './app-avatar.component.html',
  styleUrls: ['./app-avatar.component.scss'],
})
export class AppAvatarComponent {
  @Input() src = '';
  @Input() name = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    if (!this.name) {
      return '';
    }
    return this.name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
