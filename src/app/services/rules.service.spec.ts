import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RulesService } from './rules.service';

describe('RulesService', () => {
  let service: RulesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RulesService]
    });
    service = TestBed.inject(RulesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch rules', () => {
    const mockRules = [
      { id: 1, name: 'Rule 1', header: 'Header', footer: 'Footer', isActive: true, createdAt: '2024-01-01' }
    ];

    service.getRules().subscribe(rules => {
      expect(rules).toEqual(mockRules);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/rules');
    expect(req.request.method).toBe('GET');
    req.flush(mockRules);
  });
});