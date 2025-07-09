import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members-card',
  imports: [],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css'
})
export class MembersCard {
   @Input() member: any
   
   constructor(private router: Router) {}

   viewProfile() {
     console.log('Navigating to profile:', this.member.userName);
     this.router.navigate(['/members', this.member.userName]);
   }

   addFriend() {
     console.log('Add friend:', this.member.knownAs);
     // Add friend logic here
   }

   toggleLike() {
     console.log('Toggle like:', this.member.knownAs);
     // Like/unlike logic here
   }

   sendMessage() {
     console.log('Send message to:', this.member.knownAs);
     // Message logic here
   }
}
