import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../_services/account';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(Account);
  const router = inject(Router);
  const toaster= inject(ToastrService);

  if (accountService.currentUser()) {
    return true;
  } else {
    toaster.error('Please login first!');
    router.navigate(['/']);
    return false;
  }
};