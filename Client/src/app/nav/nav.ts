import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Account } from '../_services/account';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,NgbDropdownModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  model: any ={}
  accountService=inject(Account)

  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
      } 
    });
  }
  logout(){
    this.accountService.logout();
  }

}
