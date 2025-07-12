import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, MessageParams } from '../_services/message.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  private messageService = inject(MessageService);
  private router = inject(Router);
  
  messages: Message[] = [];
  loading = false;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    const messageParams: MessageParams = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      container: this.container
    };

    this.messageService.getMessages(messageParams).subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading messages:', error);
        this.loading = false;
      }
    });
  }

  deleteMessage(event: Event, id: number) {
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
      },
      error: (error: any) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  openThread(username: string) {
    this.router.navigate(['/messages', username]);
  }

  onContainerChange() {
    this.pageNumber = 1;
    this.loadMessages();
  }
}
