import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
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
    return this.http.get<Member[]>(this.baseUrl + 'users',this.getHttpOptions());
  }
  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username , this.getHttpOptions());
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
