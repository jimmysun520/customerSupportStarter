import { TestBed, async, inject } from '@angular/core/testing';

import { SaveEditUserGuard } from './save-edit-user.guard';

describe('SaveEditUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveEditUserGuard]
    });
  });

  it('should ...', inject([SaveEditUserGuard], (guard: SaveEditUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
