import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequenceComponent } from './frequence.component';

describe('FrequenceComponent', () => {
  let component: FrequenceComponent;
  let fixture: ComponentFixture<FrequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
