import { Component, inject, OnInit } from '@angular/core';
import { Likes } from '../_services/likes';
import { Member } from '../models/member';
import { CommonModule } from '@angular/common';
import { MembersCard } from '../members/members-card/members-card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lists',
  imports: [CommonModule, MembersCard, RouterModule],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  likeService = inject(Likes);
  members: Member[] = [];
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.loading = true;
    this.likeService.getLikes(this.predicate).subscribe({
      next: members => {
        this.members = members || [];
        console.log('Members loaded:', this.members);
        this.loading = false;
      },
      error: error => {
        console.error('Error loading members:', error);
        this.members = [];
        this.loading = false;
      }
    });
  }

  toggleTab(predicate: string) {
    this.predicate = predicate;
    this.loadMembers();
  }
}
