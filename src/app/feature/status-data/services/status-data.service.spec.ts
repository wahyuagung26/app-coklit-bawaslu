import { TestBed } from '@angular/core/testing';

import { StatusDataService } from './status-data.service';

describe('StatusDataService', () => {
  let service: StatusDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
