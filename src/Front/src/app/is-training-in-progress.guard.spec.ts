import { TestBed } from '@angular/core/testing';

import { IsTrainingInProgressGuard } from './is-training-in-progress.guard';

describe('IsTrainingInProgressGuard', () => {
  let guard: IsTrainingInProgressGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsTrainingInProgressGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
