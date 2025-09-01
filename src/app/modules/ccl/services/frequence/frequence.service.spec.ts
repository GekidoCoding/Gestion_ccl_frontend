import { TestBed } from '@angular/core/testing';

import { FrequenceService } from './frequence.service';

describe('FrequenceService', () => {
  let service: FrequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
