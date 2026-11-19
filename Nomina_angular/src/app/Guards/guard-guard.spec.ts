import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardGuard } from './guard-guard';

describe('guardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('Debería crearse', () => {
    expect(executeGuard).toBeTruthy();
  });
});
