import { Component } from '@angular/core';
import { IonContent, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonText],
  template: `
    <ion-content class="ion-padding">
      <ion-text>Login — à implémenter</ion-text>
    </ion-content>
  `,
})
export class LoginPage {}
