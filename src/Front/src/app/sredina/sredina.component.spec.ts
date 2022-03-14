import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SredinaComponent } from './sredina.component';

describe('SredinaComponent', () => {
  let component: SredinaComponent;
  let fixture: ComponentFixture<SredinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SredinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SredinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
