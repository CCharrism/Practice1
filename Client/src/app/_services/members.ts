import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { MemberUpdateDto } from '../DTOs/memberUpdateDto';
import { Account } from './account';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  private accountService = inject(Account);
  constructor() { 

  }
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users');
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
