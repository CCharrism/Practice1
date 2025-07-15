import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Likes } from './likes'; // Importing LikesService

@Injectable({
  providedIn: 'root'
})
export class Account {

  http = inject(HttpClient);
  router = inject(Router);
  currentUser=signal<User | null>(null);
  private likesService=inject(Likes); // Injecting LikesService as a string token
 
  baseUrl = environment.apiUrl;

 roles=computed(()=>{
   const user =this.currentUser();
   if(user && user.token){
    const role=JSON.parse(atob(user.token.split('.')[1])).role;
    return Array.isArray(role)? role: [role];
   }
   return []
 })


  login(model: any) {
    console.log(this.roles());
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
    this.likesService.getLikeIds(); // Fetching like IDs after setting the current user
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
