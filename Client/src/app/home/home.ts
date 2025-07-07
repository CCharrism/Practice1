import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Register } from '../register/register';
import { Account } from '../_services/account';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Register, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   showRegister = false;
   accountService = inject(Account);

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  cancelRegisterMode(event: boolean) {
    this.showRegister = event;
  }
}
