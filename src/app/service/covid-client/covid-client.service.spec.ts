import { TestBed } from '@angular/core/testing';

import { CovidClientService } from './covid-client.service';

describe('CovidClientService', () => {
  let service: CovidClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
