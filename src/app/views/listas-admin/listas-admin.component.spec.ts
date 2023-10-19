import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListasAdminComponent } from './listas-admin.component';

describe('ListasAdminComponent', () => {
  let component: ListasAdminComponent;
  let fixture: ComponentFixture<ListasAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
