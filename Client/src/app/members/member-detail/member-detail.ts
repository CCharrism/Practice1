import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembersService } from '../../_services/members';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css'
})
export class MemberDetail implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  membersService = inject(MembersService);

  member: Member | undefined;
  activeTab: string = 'about';
  messageText: string = '';
  selectedPhotoIndex: number = 0;
  selectedPhoto: any = null;

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.membersService.getMember(username).subscribe({
        next: member => {
          this.member = member;
          console.log('Member loaded:', member);
          if (member.photos && member.photos.length > 0) {
            this.selectedPhoto = member.photos[0];
            this.selectedPhotoIndex = 0;
            console.log('Photos available:', member.photos.length);
          } else {
            this.selectedPhoto = null;
            this.selectedPhotoIndex = 0;
            console.log('No photos available');
          }
        },
        error: error => {
          console.error('Error loading member:', error);
        }
      });
    } else {
      console.error('Username not found in route parameters');
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  selectPhoto(index: number) {
    if (this.member?.photos && this.member.photos[index]) {
      this.selectedPhoto = this.member.photos[index];
      this.selectedPhotoIndex = index;
    }
  }

  goBack() {
    this.router.navigate(['/members']);
  }

  sendMessage() {
    if (this.messageText.trim()) {
      console.log('Sending message:', this.messageText);
      // Implement message sending logic here
      this.messageText = '';
    }
  }

  openPhotoModal(photo: any) {
    console.log('Opening photo modal:', photo);
    // Implement photo modal logic here
  }
}
