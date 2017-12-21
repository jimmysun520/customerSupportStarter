import { TestBed, async, inject } from '@angular/core/testing';

import { LoadUserDetailGuard } from './load-user-detail.guard';

xdescribe('LoadUserDetailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadUserDetailGuard]
    });
  });

  it('should ...', inject([LoadUserDetailGuard], (guard: LoadUserDetailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
