import { TestBed } from '@angular/core/testing';

import { GestionnaireService } from './gestionnaire.service';

describe('GestionnaireService', () => {
  let service: GestionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
