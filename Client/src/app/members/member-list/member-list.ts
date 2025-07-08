import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from "../../_services/members";
import { Member } from '../../models/member';
import { HttpClient } from '@angular/common/http';
import { MembersCard } from "../members-card/members-card";
@Component({
  selector: 'app-member-list',
  imports: [MembersCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  private membersService = inject(MembersService);


  ngOnInit() {
    this.loadMembers();
  } 
  members: Member[] = [];  
  loadMembers() {
   this.membersService.getMembers().subscribe({
      next: members => {  
        this.members = members;
        console.log('Members loaded:', this.members);
      },
      error: error => { 
        console.error('Error loading members:', error);
      } 
  })
}



}
