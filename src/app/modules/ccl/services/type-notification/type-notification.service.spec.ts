import { TestBed } from '@angular/core/testing';

import { TypeNotificationService } from './type-notification.service';

describe('TypeNotificationService', () => {
  let service: TypeNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
