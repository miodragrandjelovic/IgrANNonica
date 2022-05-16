import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredikcijaPoModeluComponent } from './predikcija-po-modelu.component';

describe('PredikcijaPoModeluComponent', () => {
  let component: PredikcijaPoModeluComponent;
  let fixture: ComponentFixture<PredikcijaPoModeluComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredikcijaPoModeluComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredikcijaPoModeluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
