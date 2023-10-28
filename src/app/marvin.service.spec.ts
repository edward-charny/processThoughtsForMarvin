import { TestBed } from '@angular/core/testing';

import { MarvinService } from './marvin.service';

describe('MarvinService', () => {
  let service: MarvinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarvinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
