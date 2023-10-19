import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlockUI, BlockUIModule } from 'primeng/blockui';



import { DisplayDocumentInstanciaComponent } from './display-document-instancia.component';

describe('DisplayDocumentInstanciaComponent', () => {
  let component: DisplayDocumentInstanciaComponent;
  let fixture: ComponentFixture<DisplayDocumentInstanciaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDocumentInstanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDocumentInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
