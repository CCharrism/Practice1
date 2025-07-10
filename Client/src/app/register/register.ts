import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input';
import { CommonModule } from '@angular/common';
import { Account } from '../_services/account';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter<boolean>();
  private accountService = inject(Account);

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  };

  registerForm = new FormGroup(
    {
      gender: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      knownAs: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(12),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.passwordsMatchValidator }
  );

  get gender(): FormControl {
    return this.registerForm.get('gender') as FormControl;
  }
  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }
  get knownAs(): FormControl {
    return this.registerForm.get('knownAs') as FormControl;
  }
  get dateOfBirth(): FormControl {
    return this.registerForm.get('dateOfBirth') as FormControl;
  }
  get city(): FormControl {
    return this.registerForm.get('city') as FormControl;
  }
  get country(): FormControl {
    return this.registerForm.get('country') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  register() {
    if (this.registerForm.valid) {
      console.log('Registered:', this.registerForm.value);
      this.accountService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('Registration successful');
        },
        error: error => {
          console.error('Registration failed:', error);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
