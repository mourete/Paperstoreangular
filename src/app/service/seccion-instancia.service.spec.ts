import { TestBed } from '@angular/core/testing';

import { SeccionInstanciaService } from './seccion-instancia.service';

describe('SeccionInstanciaService', () => {
  let service: SeccionInstanciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionInstanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
