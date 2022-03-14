import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiperparametriComponent } from './hiperparametri.component';

describe('HiperparametriComponent', () => {
  let component: HiperparametriComponent;
  let fixture: ComponentFixture<HiperparametriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiperparametriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiperparametriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
