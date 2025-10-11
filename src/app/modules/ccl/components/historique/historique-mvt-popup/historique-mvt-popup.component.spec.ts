import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueMvtPopupComponent } from './historique-mvt-popup.component';

describe('HistoriqueMvtPopupComponent', () => {
  let component: HistoriqueMvtPopupComponent;
  let fixture: ComponentFixture<HistoriqueMvtPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueMvtPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueMvtPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
