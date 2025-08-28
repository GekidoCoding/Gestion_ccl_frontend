import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieInfraComponent } from './categorie-infra.component';

describe('CategorieInfraComponent', () => {
  let component: CategorieInfraComponent;
  let fixture: ComponentFixture<CategorieInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorieInfraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
