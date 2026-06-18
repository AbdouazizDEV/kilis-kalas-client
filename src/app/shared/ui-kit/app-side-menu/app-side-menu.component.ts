import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';

export type SideMenuAction =
  | 'profile'
  | 'history'
  | 'payment'
  | 'driver-mode'
  | 'help'
  | 'logout';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonImg,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    AppAvatarComponent,
  ],
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent {
  private readonly translate = inject(TranslateService);

  @Input() isOpen = false;
  @Input() userName = 'Babacar Nguirane';
  @Input() avatarSrc = '';

  @Output() closed = new EventEmitter<void>();
  @Output() menuAction = new EventEmitter<SideMenuAction>();

  readonly closeLabel = this.translate.translate('SIDE_MENU.CLOSE');
  readonly profileLabel = this.translate.translate('SIDE_MENU.PROFILE');
  readonly historyLabel = this.translate.translate('SIDE_MENU.HISTORY');
  readonly paymentLabel = this.translate.translate('SIDE_MENU.PAYMENT');
  readonly driverModeLabel = this.translate.translate('SIDE_MENU.DRIVER_MODE');
  readonly helpLabel = this.translate.translate('SIDE_MENU.HELP');
  readonly logoutLabel = this.translate.translate('SIDE_MENU.LOGOUT');

  onBackdropClick(): void {
    this.closed.emit();
  }

  onClose(): void {
    this.closed.emit();
  }

  onItem(action: SideMenuAction): void {
    this.menuAction.emit(action);
  }
}
