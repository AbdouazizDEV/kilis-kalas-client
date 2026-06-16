import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { callOutline, happyOutline, sendOutline } from 'ionicons/icons';
import { ChatMessage } from '../../../../models/ride.model';
import { RideBookingStateService } from '../../../../services/ride/ride-booking-state.service';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';

@Component({
  selector: 'app-ride-chat',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonInput,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
  ],
  templateUrl: './ride-chat.page.html',
  styleUrls: ['./ride-chat.page.scss'],
})
export class RideChatPage implements OnInit {
  private readonly router = inject(Router);
  private readonly bookingState = inject(RideBookingStateService);

  driverName = '';
  messages: ChatMessage[] = [];
  draft = '';

  constructor() {
    addIcons({ callOutline, happyOutline, sendOutline });
  }

  ngOnInit(): void {
    const session = this.bookingState.session;
    this.driverName = session.ride?.driver?.name ?? 'Chauffeur';

    if (!session.ride?.driver) {
      void this.router.navigateByUrl('/ride-tracking');
      return;
    }

    this.bookingState.initChat();
    this.messages = [...this.bookingState.session.chatMessages];
  }

  onSend(): void {
    const text = this.draft.trim();
    if (!text) {
      return;
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'passenger',
      text,
      sentAt: new Date(),
    };

    this.bookingState.addChatMessage(message);
    this.messages = [...this.bookingState.session.chatMessages];
    this.draft = '';

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        sender: 'driver',
        text: 'D\'accord, je vous rejoins dans quelques minutes.',
        sentAt: new Date(),
      };
      this.bookingState.addChatMessage(reply);
      this.messages = [...this.bookingState.session.chatMessages];
    }, 1200);
  }
}
