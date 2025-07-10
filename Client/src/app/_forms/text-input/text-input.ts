import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.html',
})
export class TextInputComponent {
  @Input() control!: FormControl;
  @Input() type = 'text';
  @Input() placeholder = '';

  get isInvalid() {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get isValid() {
    return this.control.valid && (this.control.dirty || this.control.touched);
  }

  get errorMessages(): string[] {
    const errors = this.control.errors;
    if (!errors) return [];

    const messages: string[] = [];
    if (errors['required']) messages.push('This field is required.');
    if (errors['minlength']) {
      messages.push(`Minimum length is ${errors['minlength'].requiredLength} characters.`);
    }
    if (errors['maxlength']) {
      messages.push(`Maximum length is ${errors['maxlength'].requiredLength} characters.`);
    }
    if (errors['passwordMismatch']) {
      messages.push('Passwords must match.');
    }
    return messages;
  }
}
