import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Account } from '../_services/account';


@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {}; 
    accountService = inject(Account); 
 

  register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log('Registration successful', response);
        this.cancel();
      },
      error: error => {
        console.error('Registration failed', error);
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
