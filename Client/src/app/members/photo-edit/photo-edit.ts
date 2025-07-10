import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Photo } from '../../models/photo';
import { Member } from '../../models/member';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Account } from '../../_services/account';
import { MembersService } from '../../_services/members';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photo-edit',
  imports: [CommonModule, NgClass, NgIf, NgFor, NgStyle, FileUploadModule],
  templateUrl: './photo-edit.html',
  styleUrl: './photo-edit.css'
})
export class PhotoEdit implements OnInit    {

  member = input.required<Member>();
  private accountService = inject(Account);
  private membersService = inject(MembersService);
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>()

ngOnInit(): void {
    this.initializeUploader();
}



  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // 10 MB
    });
  
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = {...this.member()};
      updatedMember.photos.push(photo);
      
      // If this is the first photo, set it as main and update user's photo URL
      if (updatedMember.photos.length === 1) {
        photo.isMain = true;
        updatedMember.photoUrl = photo.url;
        
        // Update current user's photo URL
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          currentUser.photoUrl = photo.url;
          this.accountService.setCurrentUser(currentUser);
        }
      }
      
      this.memberChange.emit(updatedMember);
    };
  }

  setMainPhoto(photo: Photo) {
    this.membersService.setMainPhoto(photo.id).subscribe({
      next: () => {
        const updatedMember = {...this.member()};
        // Update the current main photo
        updatedMember.photos.forEach(p => p.isMain = false);
        // Set the new main photo
        const photoToUpdate = updatedMember.photos.find(p => p.id === photo.id);
        if (photoToUpdate) {
          photoToUpdate.isMain = true;
          updatedMember.photoUrl = photoToUpdate.url;
          
          // Update the current user's photo URL in the account service
          const currentUser = this.accountService.currentUser();
          if (currentUser) {
            currentUser.photoUrl = photoToUpdate.url;
            this.accountService.setCurrentUser(currentUser);
          }
        }
        this.memberChange.emit(updatedMember);
      },
      error: error => console.error('Error setting main photo:', error)
    });
  }

  editPhoto(photo: Photo) {
    console.log('Editing photo:', photo);
    // TODO: Implement edit photo logic
  }

  deletePhoto(photo: Photo) {
    if (photo.isMain) {
      console.error('Cannot delete main photo');
      return;
    }
    
    this.membersService.deletePhoto(photo.id).subscribe({
      next: () => {
        const updatedMember = {...this.member()};
        updatedMember.photos = updatedMember.photos.filter(p => p.id !== photo.id);
        this.memberChange.emit(updatedMember);
      },
      error: error => console.error('Error deleting photo:', error)
    });
  }

  selectPhoto(photo: Photo) {
    console.log('Selecting photo:', photo);
    // TODO: Implement select photo logic
  }


}
