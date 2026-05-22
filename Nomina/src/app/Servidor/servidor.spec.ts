import { TestBed } from '@angular/core/testing';

import { Servidor } from './servidor';

describe('Servidor', () => {
  let service: Servidor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servidor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
