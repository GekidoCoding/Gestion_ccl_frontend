import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementDetailComponent } from './mouvement-detail.component';

describe('MouvementDetailComponent', () => {
  let component: MouvementDetailComponent;
  let fixture: ComponentFixture<MouvementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouvementDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
