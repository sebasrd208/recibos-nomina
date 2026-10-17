import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { Servidor } from './servidor';

describe('Servidor', () => {
  let service: Servidor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Servidor,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(Servidor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería crearse', () => {
    expect(service).toBeTruthy();
  });
});
