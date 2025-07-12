import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembersService } from '../../_services/members';
import { MessageService } from '../../_services/message.service';
import { Member } from '../../models/member';
import { CreateMessage } from '../../models/message';

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
  messageService = inject(MessageService);

  member: Member | undefined;
  activeTab: string = 'about';
  messageText: string = '';
  selectedPhotoIndex: number = 0;
  selectedPhoto: any = null;
  sendingMessage: boolean = false;

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
    if (this.messageText.trim() && this.member) {
      this.sendingMessage = true;
      const message: CreateMessage = {
        recipientUsername: this.member.userName,
        content: this.messageText.trim()
      };

      this.messageService.sendMessage(message).subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
          this.messageText = '';
          this.sendingMessage = false;
          // Optionally redirect to message thread
          this.router.navigate(['/messages', this.member!.userName]);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.sendingMessage = false;
        }
      });
    }
  }

  openPhotoModal(photo: any) {
    console.log('Opening photo modal:', photo);
    // Implement photo modal logic here
  }
}
