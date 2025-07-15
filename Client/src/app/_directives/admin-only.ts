import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Account } from '../_services/account';

@Directive({
  selector: '[appAdminOnly]',
  standalone: true
})
export class AdminOnly implements OnInit {

   @Input('appAdminOnly') allowedRoles: string[] = [];
   accountService = inject(Account);
   viewContainer = inject(ViewContainerRef);
   templateRef = inject(TemplateRef);

   ngOnInit(): void {
    const userRoles = this.accountService.roles();
    const hasRole = this.allowedRoles.some(role => userRoles.includes(role));

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
