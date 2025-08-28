import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementComponent } from './mouvement.component';

describe('MouvementInfrastructureComponent', () => {
  let component: MouvementComponent;
  let fixture: ComponentFixture<MouvementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouvementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
