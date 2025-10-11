import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoWarningComponent } from './yes-no-warning.component';

describe('YesNoWarningComponent', () => {
  let component: YesNoWarningComponent;
  let fixture: ComponentFixture<YesNoWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YesNoWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
