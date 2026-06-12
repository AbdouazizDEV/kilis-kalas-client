import { Component } from '@angular/core';
import { IonContent, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [IonContent, IonText],
  template: `
    <ion-content class="ion-padding">
      <ion-text>Mot de passe oublié — à implémenter</ion-text>
    </ion-content>
  `,
})
export class ForgotPasswordPage {}
