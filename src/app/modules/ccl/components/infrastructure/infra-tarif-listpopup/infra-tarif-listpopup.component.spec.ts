import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraTarifListpopupComponent } from './infra-tarif-listpopup.component';

describe('InfraTarifListpopupComponent', () => {
  let component: InfraTarifListpopupComponent;
  let fixture: ComponentFixture<InfraTarifListpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraTarifListpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraTarifListpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
