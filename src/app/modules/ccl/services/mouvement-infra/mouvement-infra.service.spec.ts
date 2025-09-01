import { TestBed } from '@angular/core/testing';

import { MouvementInfraService } from './mouvement-infra.service';

describe('MouvementInfraService', () => {
  let service: MouvementInfraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouvementInfraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
