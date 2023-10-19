import { TestBed } from '@angular/core/testing';

import { DocumentoInstanciaService } from './documento-instancia.service';

describe('DocumentoInstanciaService', () => {
  let service: DocumentoInstanciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoInstanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
