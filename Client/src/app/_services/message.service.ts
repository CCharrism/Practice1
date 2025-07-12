import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message, CreateMessage } from '../models/message';
import { Account } from './account';
import { PaginatedResult } from '../models/pagination';

export interface MessageParams {
  pageNumber: number;
  pageSize: number;
  container: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private accountService = inject(Account);
  private baseUrl = environment.apiUrl;
  
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  constructor() { }

  sendMessage(createMessage: CreateMessage): Observable<Message> {
    return this.http.post<Message>(
      this.baseUrl + 'messages', 
      createMessage, 
      this.getHttpOptions()
    );
  }

  getMessages(messageParams: MessageParams): Observable<Message[]> {
    let params = this.setPaginationHeaders(messageParams.pageNumber, messageParams.pageSize);
    params = params.append('container', messageParams.container);

    return this.http.get<Message[]>(this.baseUrl + 'messages', {
      observe: 'response',
      params,
      ...this.getHttpOptions()
    }).pipe(
      tap((response: HttpResponse<Message[]>) => {
        this.paginatedResult.set({
          items: response.body as Message[],
          pagination: JSON.parse(response.headers.get('Pagination')!)
        });
      }),
      map((response: HttpResponse<Message[]>) => response.body as Message[])
    );
  }

  getMessageThread(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username, 
      this.getHttpOptions()
    );
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(
      this.baseUrl + 'messages/' + id, 
      this.getHttpOptions()
    );
  }

  private setPaginationHeaders(pageNumber?: number, pageSize?: number): HttpParams {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }

  private getHttpOptions() {
    const user = this.accountService.currentUser();
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    };
  }
}

// Re-export types for convenience
export type { Message, CreateMessage };
