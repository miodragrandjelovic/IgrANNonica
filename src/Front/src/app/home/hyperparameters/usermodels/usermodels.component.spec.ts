import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermodelsComponent } from './usermodels.component';

describe('UsermodelsComponent', () => {
  let component: UsermodelsComponent;
  let fixture: ComponentFixture<UsermodelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsermodelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
