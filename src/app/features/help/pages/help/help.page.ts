import { Component, inject } from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';

type HelpTab = 'faq' | 'contact';

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonIcon,
    AppBackButtonComponent,
  ],
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  private readonly translate = inject(TranslateService);

  activeTab: HelpTab = 'faq';

  readonly titleLabel = this.translate.translate('HELP.TITLE');
  readonly faqTabLabel = this.translate.translate('HELP.FAQ_TAB');
  readonly contactTabLabel = this.translate.translate('HELP.CONTACT_TAB');
  readonly contactIntroLabel = this.translate.translate('HELP.CONTACT_INTRO');
  readonly contactPhoneLabel = this.translate.translate('HELP.CONTACT_PHONE');
  readonly contactEmailLabel = this.translate.translate('HELP.CONTACT_EMAIL');

  readonly faqItems: FaqItem[] = [
    {
      id: 'order',
      questionKey: 'HELP.FAQ_ORDER_QUESTION',
      answerKey: 'HELP.FAQ_ORDER_ANSWER',
    },
    {
      id: 'payment',
      questionKey: 'HELP.FAQ_PAYMENT_QUESTION',
      answerKey: 'HELP.FAQ_PAYMENT_ANSWER',
    },
    {
      id: 'cancel',
      questionKey: 'HELP.FAQ_CANCEL_QUESTION',
      answerKey: 'HELP.FAQ_CANCEL_ANSWER',
    },
  ];

  constructor() {
    addIcons({ chevronDownOutline });
  }

  questionLabel(key: string) {
    return this.translate.translate(key);
  }

  answerLabel(key: string) {
    return this.translate.translate(key);
  }

  onTabChange(event: CustomEvent): void {
    this.activeTab = event.detail.value as HelpTab;
  }
}
