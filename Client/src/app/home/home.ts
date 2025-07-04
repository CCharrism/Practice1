import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Register } from '../register/register';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   showRegister = false;

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  cancelRegisterMode(event: boolean) {
    this.showRegister = event;
  }
}
