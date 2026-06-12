import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonImg, IonRow, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonImg, IonText],
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/onboarding/welcome'], { replaceUrl: true });
    }, 2500);
  }
}
