import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlojeviNeuroniComponent } from './slojevi-neuroni.component';

describe('SlojeviNeuroniComponent', () => {
  let component: SlojeviNeuroniComponent;
  let fixture: ComponentFixture<SlojeviNeuroniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlojeviNeuroniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlojeviNeuroniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
