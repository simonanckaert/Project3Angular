import { TestBed, inject } from '@angular/core/testing';

import { SessieDataService } from './sessie-data.service';

describe('SessieDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessieDataService]
    });
  });

  it('should be created', inject([SessieDataService], (service: SessieDataService) => {
    expect(service).toBeTruthy();
  }));
});
