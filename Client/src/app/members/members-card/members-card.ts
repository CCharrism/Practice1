import { Component, computed, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Likes } from '../../_services/likes';

@Component({
  selector: 'app-members-card',
  imports: [],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css'
})
export class MembersCard {
   @Input() member: any

   likeService=inject(Likes)
   
   constructor(private router: Router) {}

   hasLiked = computed(()=>this.likeService.likeIds().includes(this.member.id));



   viewProfile() {
     console.log('Navigating to profile:', this.member.userName);
     this.router.navigate(['/members', this.member.userName]);
   }

   addFriend() {
     console.log('Add friend:', this.member.knownAs);
     // Add friend logic here
   }

   toggleLike() {

    this.likeService.toggleLike(this.member.id).subscribe({
      next:()=>{
        this.likeService.likeIds.update(ids => {
          if (ids.includes(this.member.id)) {
            return ids.filter(id => id !== this.member.id);
          } else {
            return [...ids, this.member.id];
          }
        });
        console.log('Toggled like for member:', this.member.knownAs);
      }
    })
   }

   sendMessage() {
     console.log('Send message to:', this.member.knownAs);
    
   }
}
