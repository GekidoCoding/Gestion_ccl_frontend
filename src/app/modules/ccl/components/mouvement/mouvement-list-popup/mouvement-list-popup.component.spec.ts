import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementListPopupComponent } from './mouvement-list-popup.component';

describe('MouvementListPopupComponent', () => {
  let component: MouvementListPopupComponent;
  let fixture: ComponentFixture<MouvementListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouvementListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
