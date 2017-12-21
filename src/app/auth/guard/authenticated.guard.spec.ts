import { TestBed, async, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AdalService } from 'ng2-adal/dist/core';
import { MockAdalService } from '../../service/adal.service.mock';

import { AuthenticatedGuard } from './authenticated.guard';

xdescribe('AuthenticatedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthenticatedGuard,
        Router,
        Location,
        { provide: AdalService, useClass: MockAdalService }
      ]
    });
  });

  it('should ...', inject([AuthenticatedGuard], (guard: AuthenticatedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
