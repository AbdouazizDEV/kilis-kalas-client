import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonCol, IonGrid, IonInput, IonRow, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonInput, IonText],
  templateUrl: './app-otp-input.component.html',
  styleUrls: ['./app-otp-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppOtpInputComponent),
      multi: true,
    },
  ],
})
export class AppOtpInputComponent implements ControlValueAccessor, OnInit {
  @Input() length = 4;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChildren('otpCell', { read: ElementRef }) otpCells!: QueryList<ElementRef<HTMLElement>>;

  digits: string[] = [];

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnInit(): void {
    this.digits = Array.from({ length: this.length }, () => '');
  }

  writeValue(value: string): void {
    const chars = (value ?? '').split('').slice(0, this.length);
    this.digits = Array.from({ length: this.length }, (_, index) => chars[index] ?? '');
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

  onDigitInput(index: number, event: CustomEvent): void {
    const raw = ((event.detail.value as string) ?? '').replace(/\D/g, '');
    const digit = raw.slice(-1);
    this.digits[index] = digit;
    this.emitValue();

    if (digit && index < this.length - 1) {
      this.focusCell(index + 1);
    }
  }

  onDigitKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusCell(index - 1);
    }
  }

  private emitValue(): void {
    const value = this.digits.join('');
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private focusCell(index: number): void {
    const cell = this.otpCells.get(index)?.nativeElement.querySelector('input');
    cell?.focus();
  }

  onBlur(): void {
    this.onTouched();
  }
}
