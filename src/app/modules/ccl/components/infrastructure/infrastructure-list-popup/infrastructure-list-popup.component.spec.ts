import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureListPopupComponent } from './infrastructure-list-popup.component';

describe('InfrastructureListPopupComponent', () => {
  let component: InfrastructureListPopupComponent;
  let fixture: ComponentFixture<InfrastructureListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
