import { TestBed } from '@angular/core/testing';

import { ModeleInfraService } from './modele-infra.service';

describe('ModeleInfraService', () => {
  let service: ModeleInfraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeleInfraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
