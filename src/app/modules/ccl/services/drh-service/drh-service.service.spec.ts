import { TestBed } from '@angular/core/testing';

import { DrhServiceService } from './drh-service.service';

describe('DrhServiceService', () => {
  let service: DrhServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrhServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
