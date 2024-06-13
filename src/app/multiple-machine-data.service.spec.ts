import { TestBed } from '@angular/core/testing';

import { MultipleMachineDataService } from './multiple-machine-data.service';

describe('MultipleMachineDataService', () => {
  let service: MultipleMachineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleMachineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
