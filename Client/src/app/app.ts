import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from "./nav/nav";
import { Account } from './_services/account';
import { LoadingService } from './_services/loading.service';
import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  accountService = inject(Account);
  loadingService = inject(LoadingService);
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() { 
    const userString = localStorage.getItem('user');
    if (!userString) return;
   
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.accountService.setCurrentUser(user);

   }
}
