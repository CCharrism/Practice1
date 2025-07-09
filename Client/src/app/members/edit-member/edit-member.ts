import { Component, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MembersService } from '../../_services/members';
import { Account } from '../../_services/account';
import { Member } from '../../models/member';
import { CanComponentDeactivate } from '../../_guards/prevent-unsaved-changes.guard';
import { PhotoEdit } from "../photo-edit/photo-edit";

@Component({
  selector: 'app-edit-member',
  imports: [CommonModule, DatePipe, FormsModule, PhotoEdit],
  templateUrl: './edit-member.html',
  styleUrl: './edit-member.css'
})
export class EditMember implements OnInit, CanComponentDeactivate {
  @ViewChild('editForm') editForm!: NgForm;
  
  route = inject(ActivatedRoute);
  router = inject(Router);
  membersService = inject(MembersService);
  accountService = inject(Account);

  member: Member | undefined;
  activeTab: string = 'about';
  isLoading: boolean = false;
  hasUnsavedChanges: boolean = false;
  showSuccessMessage: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedChanges) {
      $event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  }

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (user?.username) {
      this.isLoading = true;
      this.membersService.getMember(user.username).subscribe({
        next: member => {
          this.member = member;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading member:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  setActiveTab(tab: string) {
    if (this.hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    this.activeTab = tab;
  }

  onFormChange() {
    this.hasUnsavedChanges = true;
    this.showSuccessMessage = false;
  }

  updateMember() {
    if (this.editForm.valid && this.member) {
      this.isLoading = true;
      this.membersService.updateMember(this.member).subscribe({
        next: () => {
          this.hasUnsavedChanges = false;
          this.showSuccessMessage = true;
          this.isLoading = false;
          this.editForm.reset(this.member);
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: error => {
          console.error('Error updating member:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    if (this.hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    this.router.navigate(['/members']);
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
  onMemberChange(event : Member){
    this.member = event;

  }
}
