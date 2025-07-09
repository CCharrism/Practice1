import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Account } from '../_services/account'; // Adjust the import path as necessary

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(Account); 
  if(accountService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`
      }
    });

  }
  
  return next(req);
};
