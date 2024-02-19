import { TestBed } from '@angular/core/testing';
import { ListDocumentoUsuariosService } from '../service/list-documento-usuarios.service';


describe('0', () => {
  let service: ListDocumentoUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListDocumentoUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
