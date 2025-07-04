import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from "./nav/nav";
import { Account } from './_services/account';
import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  accountService = inject(Account);
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() { 
    const userString = localStorage.getItem('user');
    if (!userString) return;
   
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);

   }
}
