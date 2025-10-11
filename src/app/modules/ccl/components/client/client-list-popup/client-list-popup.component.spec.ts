import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListPopupComponent } from './client-list-popup.component';

describe('ClientListPopupComponent', () => {
  let component: ClientListPopupComponent;
  let fixture: ComponentFixture<ClientListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
