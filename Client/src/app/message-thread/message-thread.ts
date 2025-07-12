import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../_services/message.service';
import { Message, CreateMessage } from '../models/message';

@Component({
  selector: 'app-message-thread',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css'
})
export class MessageThread implements OnInit, OnDestroy {
  username = '';
  messages: Message[] = [];
  loading = false;
  sending = false;
  messageContent = '';

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') || '';
    if (this.username) {
      this.loadMessages();
    }
  }

  ngOnDestroy() {
    // Mark messages as read when leaving the component
    this.markMessagesAsRead();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessageThread(this.username).subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading message thread:', error);
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.messageContent.trim()) return;

    this.sending = true;
    const message: CreateMessage = {
      recipientUsername: this.username,
      content: this.messageContent.trim()
    };

    this.messageService.sendMessage(message).subscribe({
      next: (newMessage: Message) => {
        this.messages.push(newMessage);
        this.messageContent = '';
        this.sending = false;
      },
      error: (error: any) => {
        console.error('Error sending message:', error);
        this.sending = false;
      }
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
      },
      error: (error: any) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/messages']);
  }

  private markMessagesAsRead() {
    // Logic to mark messages as read would go here
    // This would typically involve another API call
  }
}
