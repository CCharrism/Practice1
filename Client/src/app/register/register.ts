import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Account } from '../_services/account';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {}; 
  accountService = inject(Account); 
  registerForm = new FormGroup({});
  
  ngOnInit() {
   this.initializeForm();
  }

  initializeForm(){
    this.registerForm = new FormGroup({
  username: new FormControl('', [Validators.required]),
  password: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(12)
        ]),
  confirmPassword: new FormControl('', [Validators.required])
},
{ validators: this.passwordsMatchValidator }

) as FormGroup


  }
  // Custom Validator: Passwords match
  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  // Helper for showing errors
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  register() {
    // this.accountService.register(this.model).subscribe({
    //   next: response => {
    //     console.log('Registration successful', response);
    //     this.cancel();
    //   },
    //   error: error => {
    //     console.error('Registration failed', error);
    //   }
    // });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
