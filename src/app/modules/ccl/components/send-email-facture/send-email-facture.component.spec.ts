import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailFactureComponent } from './send-email-facture.component';

describe('SendEmailFactureComponent', () => {
  let component: SendEmailFactureComponent;
  let fixture: ComponentFixture<SendEmailFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
