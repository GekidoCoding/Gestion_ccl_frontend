import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeClientComponent } from './type-client.component';

describe('TypeClientComponent', () => {
  let component: TypeClientComponent;
  let fixture: ComponentFixture<TypeClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
