import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeClientUpdateComponent } from './type-client-update.component';

describe('TypeClientUpdateComponent', () => {
  let component: TypeClientUpdateComponent;
  let fixture: ComponentFixture<TypeClientUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeClientUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeClientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
