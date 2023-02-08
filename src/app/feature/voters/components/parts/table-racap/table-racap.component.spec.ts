import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRacapComponent } from './table-racap.component';

describe('TableRacapComponent', () => {
  let component: TableRacapComponent;
  let fixture: ComponentFixture<TableRacapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRacapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRacapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
