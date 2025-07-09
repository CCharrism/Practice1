import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = signal(0);
  isLoading = this.loadingCount.asReadonly();

  show() {
    this.loadingCount.update(count => count + 1);
  }

  hide() {
    this.loadingCount.update(count => Math.max(0, count - 1));
  }

  get loading() {
    return this.loadingCount() > 0;
  }
}
