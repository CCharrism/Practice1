import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Account {

  http = inject(HttpClient);
  router = inject(Router);
  currentUser=signal<User | null>(null);
 
  baseUrl = environment.apiUrl;

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user=>{
       if(user){
        console.log(user);
        this.setCurrentUser(user);
         console.log(this.currentUser())
        } 
      })
    ); 

  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user=>{
       if(user){
          this.setCurrentUser(user);
        }
        
      })
       
    ); 

  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  updateCurrentUserPhoto(photoUrl: string) {
    const currentUser = this.currentUser();
    if (currentUser) {
      currentUser.photoUrl = photoUrl;
      this.setCurrentUser(currentUser);
    }
  }
}
