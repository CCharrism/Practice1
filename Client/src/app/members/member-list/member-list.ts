import { Component, inject, OnInit, computed } from '@angular/core';
import { MembersService } from "../../_services/members";
import { Member } from '../../models/member';
import { HttpClient } from '@angular/common/http';
import { MembersCard } from "../members-card/members-card";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserParams } from '../../models/userParams';
import { Account } from '../../_services/account';


@Component({
  selector: 'app-member-list',
  imports: [MembersCard, CommonModule, FormsModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  private membersService = inject(MembersService);
  private accountService = inject(Account);
  
  // Expose Math for template usage
  Math = Math;
  
  // Loading state for pagination
  isLoading = false;

  // Filter options
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  
  // Get members from the service signal
  members = computed(() => this.membersService.paginatedResult()?.items || []);
  pagination = computed(() => this.membersService.paginatedResult()?.pagination);
  userParams = computed(() => this.membersService.userParams());

  ngOnInit() {
    this.loadMembers();
  } 
  
  loadMembers() {
    if (this.isLoading) return; // Prevent multiple simultaneous loads
    
    this.isLoading = true;
    const userParams = this.userParams();
    if (userParams) {
      this.membersService.getMembers(userParams);
    }
    // Set loading to false after a short delay to allow for smooth transitions
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  onPageChanged(pageNumber: number) {
    const userParams = this.userParams();
    if (userParams) {
      userParams.pageNumber = pageNumber;
      this.membersService.userParams.set(userParams);
      // Smooth scroll to top of member list
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadMembers();
    }
  }

  resetFilters() {
    const user = this.accountService.currentUser();
    if (user) {
      this.membersService.userParams.set(new UserParams(user));
      this.loadMembers();
    }
  }

  onFilterChange() {
    const userParams = this.userParams();
    if (userParams) {
      userParams.pageNumber = 1;
      this.membersService.userParams.set(userParams);
      this.loadMembers();
    }
  }

  // Helper method to get array of page numbers for pagination
  getPageNumbers(): number[] {
    const pagination = this.pagination();
    if (!pagination) return [];
    
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pages: number[] = [];
    
    // Show max 5 pages at a time
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
