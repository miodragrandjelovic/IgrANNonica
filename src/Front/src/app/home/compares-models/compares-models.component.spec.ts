import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparesModelsComponent } from './compares-models.component';

describe('ComparesModelsComponent', () => {
  let component: ComparesModelsComponent;
  let fixture: ComponentFixture<ComparesModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparesModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparesModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
