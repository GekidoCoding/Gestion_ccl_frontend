import { TestBed } from '@angular/core/testing';

import { TypeMouvementService } from './type-mouvement.service';

describe('TypeMouvementService', () => {
  let service: TypeMouvementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeMouvementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
