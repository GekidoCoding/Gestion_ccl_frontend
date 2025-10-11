import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeClientAddComponent } from './type-client-add.component';

describe('TypeClientAddComponent', () => {
  let component: TypeClientAddComponent;
  let fixture: ComponentFixture<TypeClientAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeClientAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeClientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
