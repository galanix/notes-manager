import { TestBed, inject } from '@angular/core/testing';

import { EnterFormService } from './enter-form.service';

describe('EnterFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterFormService]
    });
  });

  it('should be created', inject([EnterFormService], (service: EnterFormService) => {
    expect(service).toBeTruthy();
  }));
});
