import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVotersComponent } from './form-voters.component';

describe('FormVotersComponent', () => {
  let component: FormVotersComponent;
  let fixture: ComponentFixture<FormVotersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVotersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
