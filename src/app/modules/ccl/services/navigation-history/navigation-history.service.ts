// src/app/services/navigation-history.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'; // Correct import for filter
import { Observable } from 'rxjs'; // Import Observable for type safety

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  private history: string[] = [];
  private currentIndex: number = -1;

  constructor(private router: Router) {
    (this.router.events as Observable<any>) // Type assertion for safety
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.history = this.history.slice(0, this.currentIndex + 1); // Remove forward history on new navigation
          this.history.push(event.urlAfterRedirects);
          this.currentIndex++;
        });
  }

  goBack(): string | null {
    if (this.canGoBack()) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  goForward(): string | null {
    if (this.canGoForward()) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}