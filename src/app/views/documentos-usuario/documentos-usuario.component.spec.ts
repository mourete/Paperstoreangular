import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentosUsuarioComponent } from './documentos-usuario.component';

describe('DocumentosUsuarioComponent', () => {
  let component: DocumentosUsuarioComponent;
  let fixture: ComponentFixture<DocumentosUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
