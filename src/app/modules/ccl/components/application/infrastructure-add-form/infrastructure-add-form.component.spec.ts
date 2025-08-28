import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAddFormComponent } from './infrastructure-add-form.component';

describe('InfrastructureAddFormComponent', () => {
  let component: InfrastructureAddFormComponent;
  let fixture: ComponentFixture<InfrastructureAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureAddFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
