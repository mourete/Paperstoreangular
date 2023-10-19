import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDocumentoUsuariosComponent } from './list-documento-usuarios.component';

describe('ListDocumentoUsuariosComponent', () => {
  let component: ListDocumentoUsuariosComponent;
  let fixture: ComponentFixture<ListDocumentoUsuariosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDocumentoUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
