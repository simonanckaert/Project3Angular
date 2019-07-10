import { TestBed } from '@angular/core/testing';

import { GebruikerDataService } from './gebruiker-data.service';

describe('GebruikerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GebruikerDataService = TestBed.get(GebruikerDataService);
    expect(service).toBeTruthy();
  });
});
