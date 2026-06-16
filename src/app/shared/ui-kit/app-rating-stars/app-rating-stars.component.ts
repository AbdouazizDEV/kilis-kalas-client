import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon],
  templateUrl: './app-rating-stars.component.html',
  styleUrls: ['./app-rating-stars.component.scss'],
})
export class AppRatingStarsComponent {
  @Input() rating = 0;
  @Input() maxStars = 5;
  @Input() readonly = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() ratingChange = new EventEmitter<number>();

  constructor() {
    addIcons({ star, starOutline });
  }

  get stars(): number[] {
    return Array.from({ length: this.maxStars }, (_, i) => i + 1);
  }

  isFilled(star: number): boolean {
    return star <= Math.round(this.rating);
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }
}
