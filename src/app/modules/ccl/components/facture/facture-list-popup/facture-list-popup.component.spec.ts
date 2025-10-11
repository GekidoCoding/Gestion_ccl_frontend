import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureListPopupComponent } from './facture-list-popup.component';

describe('FactureListPopupComponent', () => {
  let component: FactureListPopupComponent;
  let fixture: ComponentFixture<FactureListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
