import { ApplicationModule, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Account } from '../_services/account';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminOnly } from '../_directives/admin-only'; // Assuming you have a directive for role checking

@Component({
  selector: 'app-nav',
  imports: [FormsModule,NgbDropdownModule,RouterLink,RouterLinkActive,AdminOnly],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  
  model: any ={}
  accountService=inject(Account)
  toaster = inject(ToastrService);

  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        this.toaster.error(error.error);
        
      } 
    });
  }
  logout(){
    this.accountService.logout();
  }

}
