import { TestBed } from '@angular/core/testing';

import { HistoFactureService } from './histo-facture.service';

describe('HistoFactureService', () => {
  let service: HistoFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
