import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleInfraUpdateFormComponent } from './modele-infra-update-form.component';

describe('ModeleInfraUpdateFormComponent', () => {
  let component: ModeleInfraUpdateFormComponent;
  let fixture: ComponentFixture<ModeleInfraUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeleInfraUpdateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeleInfraUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
