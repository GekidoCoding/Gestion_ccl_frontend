import { TestBed } from '@angular/core/testing';

import { InfraTarifService } from './infra-tarif.service';

describe('InfraTarifService', () => {
  let service: InfraTarifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfraTarifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
