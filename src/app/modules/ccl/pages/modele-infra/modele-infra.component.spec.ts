import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleInfraComponent } from './modele-infra.component';

describe('ModeleInfraComponent', () => {
  let component: ModeleInfraComponent;
  let fixture: ComponentFixture<ModeleInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeleInfraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeleInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
