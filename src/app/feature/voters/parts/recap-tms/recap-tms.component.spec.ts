import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapTmsComponent } from './recap-tms.component';

describe('RecapTmsComponent', () => {
  let component: RecapTmsComponent;
  let fixture: ComponentFixture<RecapTmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapTmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapTmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
