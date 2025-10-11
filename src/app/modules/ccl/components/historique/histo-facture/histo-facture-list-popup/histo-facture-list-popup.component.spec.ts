import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoFactureListPopupComponent } from './histo-facture-list-popup.component';

describe('HistoFactureListPopupComponent', () => {
  let component: HistoFactureListPopupComponent;
  let fixture: ComponentFixture<HistoFactureListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoFactureListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoFactureListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
