import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RegisterComponent } from '../register/register';
import { Account } from '../_services/account';
import { RouterLink } from '@angular/router';
import { VantaBackgroundComponent } from "../vanta-background/vanta-background";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, RegisterComponent, VantaBackgroundComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   accountService = inject(Account);

  cancelRegisterMode(event: boolean) {
    // Handle cancel register if needed
    console.log('Register cancelled:', event);
  }
}
