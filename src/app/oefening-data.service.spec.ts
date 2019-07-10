import { TestBed, inject } from '@angular/core/testing';

import { OefeningDataService } from './oefening-data.service';

describe('OefeningDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OefeningDataService]
    });
  });

  it('should be created', inject([OefeningDataService], (service: OefeningDataService) => {
    expect(service).toBeTruthy();
  }));
});
