import { TestBed } from '@angular/core/testing';

import { MultipleMechineLinePathService } from './multiple-mechine-line-path.service';

describe('MultipleMechineLinePathService', () => {
  let service: MultipleMechineLinePathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleMechineLinePathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
