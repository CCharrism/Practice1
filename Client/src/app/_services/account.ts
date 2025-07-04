import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class Account {

  http = inject(HttpClient);
  currentUser=signal<User | null>(null);
 
  baseUrl = 'https://localhost:5001/api/';

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.currentUser.set(user);
      })
    ); 

  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.currentUser.set(user);
        return user;
      })
       
    ); 

  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
