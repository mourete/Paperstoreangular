import { TestBed } from '@angular/core/testing';

import { ListDocumentoUsuariosService } from './list-documento-usuarios.service';

describe('ListaDocumentoUsuarioService', () => {
  let service: ListDocumentoUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListDocumentoUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
