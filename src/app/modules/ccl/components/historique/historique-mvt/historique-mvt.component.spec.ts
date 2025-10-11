import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueMvtComponent } from './historique-mvt.component';

describe('HistoriqueMvtComponent', () => {
  let component: HistoriqueMvtComponent;
  let fixture: ComponentFixture<HistoriqueMvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueMvtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueMvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
