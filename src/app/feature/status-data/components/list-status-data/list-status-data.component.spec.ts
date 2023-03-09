import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStatusDataComponent } from './list-status-data.component';

describe('ListStatusDataComponent', () => {
  let component: ListStatusDataComponent;
  let fixture: ComponentFixture<ListStatusDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStatusDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStatusDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
