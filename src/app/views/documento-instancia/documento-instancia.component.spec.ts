import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoInstanciaComponent } from './documento-instancia.component';

describe('DocumentoInstanciaComponent', () => {
  let component: DocumentoInstanciaComponent;
  let fixture: ComponentFixture<DocumentoInstanciaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInstanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
