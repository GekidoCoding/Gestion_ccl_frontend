import { TestBed } from '@angular/core/testing';

import { CategorieInfraService } from './categorie-infra.service';

describe('CategorieInfraService', () => {
  let service: CategorieInfraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieInfraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
