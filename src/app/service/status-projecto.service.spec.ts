import { TestBed } from '@angular/core/testing';

import { StatusProjectoService } from './status-projecto.service';

describe('StatusProjectoService', () => {
  let service: StatusProjectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusProjectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
