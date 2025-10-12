import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementVisualisationComponent } from './mouvement-visualisation.component';

describe('MouvementVisualisationComponent', () => {
  let component: MouvementVisualisationComponent;
  let fixture: ComponentFixture<MouvementVisualisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouvementVisualisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouvementVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
