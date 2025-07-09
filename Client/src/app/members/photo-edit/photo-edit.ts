import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Photo } from '../../models/photo';
import { Member } from '../../models/member';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Account } from '../../_services/account';
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
      const updatedMember={...this.member()}
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
    };
  }

  setMainPhoto(photo: Photo) {
    console.log('Setting main photo:', photo);
    // TODO: Implement set main photo logic
  }

  editPhoto(photo: Photo) {
    console.log('Editing photo:', photo);
    // TODO: Implement edit photo logic
  }

  deletePhoto(photo: Photo) {
    console.log('Deleting photo:', photo);
    // TODO: Implement delete photo logic
  }

  selectPhoto(photo: Photo) {
    console.log('Selecting photo:', photo);
    // TODO: Implement select photo logic
  }


}
