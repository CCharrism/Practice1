import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { MemberUpdateDto } from '../DTOs/memberUpdateDto';
import { Account } from './account';
import { PaginatedResult} from '../models/pagination';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult=signal<PaginatedResult<Member[]> | null>(null);
  userParams = signal<UserParams | null>(null);

  private accountService = inject(Account);
  
  constructor() { 
    this.accountService.currentUser()
    const user = this.accountService.currentUser();
    if (user) {
      this.userParams.set(new UserParams(user));
    }
  }
  getMembers(userParams : UserParams) {
    let params=this.setPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
   
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).subscribe({
      next: response => {
        this.paginatedResult.set({
          items: response.body as Member[],
          pagination: JSON.parse(response.headers.get('Pagination')!)
        });
      },
      error: error => {
        console.error('Error loading members:', error);
        this.paginatedResult.set({
          items: [],
          pagination: undefined
        });
      }
    });
  }
  setPaginationHeaders(pageNumber?: number, pageSize?: number) {
     let params = new HttpParams();
    if(pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }
  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    const updateDto: MemberUpdateDto = {
      introduction: member.introduction,
      lookingFor: member.lookingFor,
      interests: member.interests,
      city: member.city,
      country: member.country
    };
    return this.http.put(this.baseUrl + 'users/update-profile', updateDto, this.getHttpOptions());
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}, this.getHttpOptions());
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId, this.getHttpOptions());
  }

  getHttpOptions() {  
    // const user = this.accountService.currentUser();
    // if (!user) return {};
    return {
      headers: {
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      }
    };
  }
}