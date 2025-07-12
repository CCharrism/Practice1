import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class Likes {

  baseUrl = environment.apiUrl;
  http= inject(HttpClient);
  likeIds = signal<number[]>([]);

  toggleLike(targetId: number) {

    return this.http.post(this.baseUrl + 'likes/' + targetId, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Member[]>(this.baseUrl + 'likes?predicate=' + predicate);
  }
  getLikeIds(){
    return this.http.get<number[]>(this.baseUrl + 'likes/list').subscribe({
      next : id=>this.likeIds.set(id)
    });}


}