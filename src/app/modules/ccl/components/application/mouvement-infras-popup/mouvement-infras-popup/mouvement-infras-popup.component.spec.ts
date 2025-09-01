import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementInfrasPopupComponent } from './mouvement-infras-popup.component';

describe('MouvementInfrasPopupComponent', () => {
  let component: MouvementInfrasPopupComponent;
  let fixture: ComponentFixture<MouvementInfrasPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouvementInfrasPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementInfrasPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
