import { CanActivateFn } from '@angular/router';
import { Account } from '../_services/account';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService=inject(Account);
  const toaster=inject(ToastrService);
  if(accountService.roles().includes('Admin')|| accountService.roles().includes('Moderator')){
    return true;
  }else{
    toaster.error("You cannot Enter this area!")
    return false;
  }

  
};
