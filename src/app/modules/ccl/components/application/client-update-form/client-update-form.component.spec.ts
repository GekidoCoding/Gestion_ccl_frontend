import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUpdateFormComponent } from './client-update-form.component';

describe('ClientUpdateFormComponent', () => {
  let component: ClientUpdateFormComponent;
  let fixture: ComponentFixture<ClientUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientUpdateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
