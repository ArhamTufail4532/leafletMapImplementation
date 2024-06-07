import { TestBed } from '@angular/core/testing';

import { MechineDataServiceService } from './mechine-data-service.service';

describe('MechineDataServiceService', () => {
  let service: MechineDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechineDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
