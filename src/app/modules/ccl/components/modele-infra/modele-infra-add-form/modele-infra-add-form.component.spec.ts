import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleInfraAddFormComponent } from './modele-infra-add-form.component';

describe('ModeleInfraAddFormComponent', () => {
  let component: ModeleInfraAddFormComponent;
  let fixture: ComponentFixture<ModeleInfraAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeleInfraAddFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeleInfraAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
