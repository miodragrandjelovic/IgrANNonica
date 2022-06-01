import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavedialogueComponent } from './leavedialogue.component';

describe('LeavedialogueComponent', () => {
  let component: LeavedialogueComponent;
  let fixture: ComponentFixture<LeavedialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavedialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavedialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
