import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NavigationHistoryService} from "../../../ccl/services/navigation-history/navigation-history.service";

@Component({
  selector: 'app-floating-nav',
  templateUrl: './floating-nav.component.html',
  styleUrls: ['./floating-nav.component.scss'],
})
export class FloatingNavComponent {
  canGoBack: boolean = false;
  canGoForward: boolean = false;

  constructor(
      private navHistoryService: NavigationHistoryService,
      private router: Router
  ) {
    // Update button states based on history
    this.updateButtonStates();
    this.router.events.subscribe(() => this.updateButtonStates());
  }

  private updateButtonStates(): void {
    this.canGoBack = this.navHistoryService.canGoBack();
    this.canGoForward = this.navHistoryService.canGoForward();
  }

  navigateBack(): void {
    const url = this.navHistoryService.goBack();
    if (url) {
      this.router.navigateByUrl(url);
    }
  }

  navigateForward(): void {
    const url = this.navHistoryService.goForward();
    if (url) {
      this.router.navigateByUrl(url);
    }
  }
}