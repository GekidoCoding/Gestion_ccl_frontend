import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInfrastructureComponent } from './detail-infrastructure.component';

describe('DetailInfrastructureComponent', () => {
  let component: DetailInfrastructureComponent;
  let fixture: ComponentFixture<DetailInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
