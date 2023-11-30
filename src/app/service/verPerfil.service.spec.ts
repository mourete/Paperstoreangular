import { TestBed } from '@angular/core/testing';

import { VerPerfilService } from './verPerfil.service';

describe('VerPerfilService', () => {
  let service: VerPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
