import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

export type AppInputVariant = 'default' | 'pill';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonNote, IonIcon],
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'number' = 'text';
  @Input() variant: AppInputVariant = 'default';
  @Input() errorMessage = '';
  @Input() disabled = false;
  @Input() showPasswordToggle = false;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  passwordVisible = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  get inputType(): string {
    if (this.type === 'password' && this.showPasswordToggle && this.passwordVisible) {
      return 'text';
    }
    return this.type;
  }

  get toggleIcon(): string {
    return this.passwordVisible ? 'eye-outline' : 'eye-off-outline';
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: CustomEvent): void {
    const newValue = (event.detail.value as string) ?? '';
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
