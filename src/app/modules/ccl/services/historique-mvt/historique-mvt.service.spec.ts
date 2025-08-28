import { TestBed } from '@angular/core/testing';

import { HistoriqueMvtService } from './historique-mvt.service';

describe('HistoriqueMvtService', () => {
  let service: HistoriqueMvtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueMvtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
