import { TestBed } from '@angular/core/testing';

import { JadoreService } from './jadore.service';

describe('JadoreService', () => {
  let service: JadoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JadoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
